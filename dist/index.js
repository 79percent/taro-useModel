"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * 自动生成.plugin/plugin-model
 */
exports.default = (ctx, { watch }) => {
    ctx.onBuildStart(() => {
        // console.log('编译开始', watch)
        const modelsDirPath = (0, path_1.resolve)(__dirname, "../../../src/models");
        const modelsPath = (0, path_1.resolve)(__dirname, "../../../src/.plugin/plugin-model/models.ts");
        // 不存在文件夹 则创建
        const createDir = (path) => {
            try {
                (0, fs_1.statSync)(path);
            }
            catch (error) {
                (0, fs_1.mkdirSync)(path);
            }
        };
        // 复制模板到.plugins下
        const copyTemplate = (templatePath, targetPath) => {
            try {
                const content = (0, fs_1.readFileSync)(templatePath, 'utf8');
                (0, fs_1.writeFileSync)(targetPath, content, { flag: "w" });
            }
            catch (error) {
                console.log('文件复制失败', error);
            }
        };
        createDir((0, path_1.resolve)(__dirname, "../../../src/.plugin"));
        createDir((0, path_1.resolve)(__dirname, "../../../src/.plugin/plugin-model"));
        const templateDir = (0, fs_1.readdirSync)((0, path_1.resolve)("./plugins/auto-model/template/plugin-model"));
        templateDir.forEach((filename) => {
            copyTemplate((0, path_1.resolve)("./plugins/auto-model/template/plugin-model/" + filename), (0, path_1.resolve)(__dirname, "../../../src/.plugin/plugin-model/" + filename));
        });
        // 文件遍历方法
        const fileDisplay = (filePath) => {
            //根据文件路径读取文件，返回文件列表
            const files = (0, fs_1.readdirSync)(filePath);
            let importContent = "/* eslint-disable import/no-absolute-path */\n// 内容由 auto-model plugins 自动生成\n";
            let exportContent = "export const models = {\n";
            //遍历读取到的文件列表
            files.forEach((filename, index) => {
                //获取当前文件的绝对路径
                const filedir = (0, path_1.join)(filePath, filename);
                const fileName = (0, path_1.basename)(filedir, ".ts");
                if (fileName !== "index") {
                    const fileAbsolutePath = (0, path_1.join)(modelsDirPath, fileName).replace(/\\/g, '/');
                    importContent = importContent + `import model_${index} from "${fileAbsolutePath}";\n`;
                    exportContent = exportContent + `\tmodel_${index}: { namespace: "${fileName}", model: model_${index} },\n`;
                }
            });
            exportContent = "\n" + exportContent + "} as const;\n";
            const content = importContent + exportContent;
            (0, fs_1.writeFileSync)(modelsPath, content, { flag: "w" });
        };
        //调用文件遍历方法
        fileDisplay(modelsDirPath);
        if (watch) {
            // 开发环境 监听文件夹变化
            (0, fs_1.watchFile)(modelsDirPath, { interval: 1000 }, () => {
                fileDisplay(modelsDirPath);
            });
        }
    });
    ctx.modifyWebpackChain(({}) => {
        // console.log("这里可以修改webpack配置");
    });
    ctx.modifyBuildAssets(({}) => {
        // console.log("修改编译后的结果");
    });
    ctx.onBuildFinish(() => {
        // console.log("Webpack 编译结束！");
    });
    ctx.onBuildComplete(() => {
        // console.log("Taro 构建完成！");
    });
};
//# sourceMappingURL=index.js.map