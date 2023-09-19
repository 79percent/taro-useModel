# taro-model-plugin

>

## 使用

### 安装

```ssh
npm i taro-plugin-model -D
```

### 使用插件（约定）

1. 在`/config/index.js`配置文件中添加插件

```js
import { resolve } from "path";

const config = {
  // ...other config
  alias: {
    "@": resolve(__dirname, "../src"), // 配置@为src
  },
  plugins: [
    [
      "taro-plugin-model",
      {
        watch: process.env.NODE_ENV === "development", // watch: true 监听实时更新;false 不监听
        dirname: resolve(__dirname, "../"), // 当前项目文件夹路径
      },
    ],
  ],
};
```

2. 在`/src/app.tsx`根组件中使用`ProviderWrapper`组件，编译时，插件会自动生成`src/.plugin`文件夹

```jsx
// /src/app.tsx
import { ProviderWrapper } from "@/.plugin/plugin-model/runtime";

function App({ children }){
  return <ProviderWrapper>{children}</ProviderWrapper>;
}

export defalut App;
```

3. 在`/src/models`目录下创建`model.{js,jsx,ts,tsx}`

```jsx
// src/models/hello.ts
import { useState } from "react";

export default function useHello() {
  const [name, setName] = useState("hello");

  return {
    name,
    setName,
  };
}
```

4. 在组件中使用 model

```jsx
// src/pages/home/index.tsx
import { useModel } from "@/.plugin/plugin-model";

export default function Home() {
  const { name, setName } = useModel("useHello");

  return <View>{name}</View>;
}
```

5. 其他的一些配置

```dockerfile
# .gitignore
# ...other files
# 提交时可忽略.plugin文件夹
/src/.plugin
```

```json
// tsconfig.json
// ...other config
{
  "compilerOptions": {
    // ...other config
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
