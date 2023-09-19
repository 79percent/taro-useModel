import type { IPluginContext } from "@tarojs/service";
import webpackChain from "webpack-chain";
import {
  readdirSync,
  writeFileSync,
  watchFile,
  readFileSync,
  statSync,
  mkdirSync,
} from "fs";
import { resolve, join, basename } from "path";

/**
 * 自动生成.plugin/plugin-model
 */
export default (ctx: IPluginContext, { watch, dirname }) => {
  ctx.onBuildStart(() => {
    // console.log("编译开始", watch, dirname);
    const modelsDirPath = resolve(dirname, "./src/models");
    const modelsPath = resolve(dirname, "./src/.plugin/plugin-model/models.ts");

    // 不存在文件夹 则创建
    const createDir = (path) => {
      try {
        statSync(path);
      } catch (error) {
        mkdirSync(path);
      }
    };

    // 复制模板到.plugins下
    const copyTemplate = (templatePath, targetPath) => {
      try {
        const content = readFileSync(templatePath, "utf8");
        writeFileSync(targetPath, content, { flag: "w" });
      } catch (error) {
        console.log("文件复制失败", error);
      }
    };

    const pluginDir = resolve(dirname, "./src/.plugin");
    const pluginModelDir = resolve(dirname, "./src/.plugin/plugin-model");

    createDir(pluginDir);
    createDir(pluginModelDir);

    const templateDir = resolve(__dirname, "../template/plugin-model");

    const templateDirFiles = readdirSync(templateDir);
    templateDirFiles.forEach((filename) => {
      const templatePath = resolve(templateDir, filename);
      const targetPath = resolve(
        dirname,
        "./src/.plugin/plugin-model/" + filename
      );
      copyTemplate(templatePath, targetPath);
    });

    // 文件遍历方法
    const fileDisplay = (filePath) => {
      //根据文件路径读取文件，返回文件列表
      const files = readdirSync(filePath);
      let importContent =
        "/* eslint-disable import/no-absolute-path */\n// 内容由 auto-model plugins 自动生成\n";
      let exportContent = "export const models = {\n";
      //遍历读取到的文件列表
      files.forEach((filename, index) => {
        //获取当前文件的绝对路径
        const filedir = join(filePath, filename);
        const fileName = basename(filedir, ".ts");
        if (fileName !== "index") {
          const fileAbsolutePath = join(modelsDirPath, fileName).replace(
            /\\/g,
            "/"
          );
          importContent =
            importContent +
            `import model_${index} from "${fileAbsolutePath}";\n`;
          exportContent =
            exportContent +
            `\tmodel_${index}: { namespace: "${fileName}", model: model_${index} },\n`;
        }
      });
      exportContent = "\n" + exportContent + "} as const;\n";
      const content = importContent + exportContent;
      writeFileSync(modelsPath, content, { flag: "w" });
    };
    //调用文件遍历方法
    fileDisplay(modelsDirPath);

    if (watch) {
      // 开发环境 监听文件夹变化
      watchFile(modelsDirPath, { interval: 1000 }, () => {
        fileDisplay(modelsDirPath);
      });
    }
  });

  ctx.modifyWebpackChain(({}: { chain: webpackChain }) => {
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
