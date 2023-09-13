# taro-model-plugin

>

## 使用

### 安装

```
npm i taro-model-plugin -D
```

### 使用插件（约定）

1. 在`/config/index.js`配置文件中添加插件

```js
const config = {
	plugins: [
		["taro-model-plugin", { watch: process.env.NODE_ENV === "development" }], // watch: true 监听实时更新;false 不监听
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
import { useState } from 'react'

export default function useHello() {
  const [name, setName] = useState('hello');

  return {
    name, setName
  };
};
```

4. 在组件中使用model
```jsx
// src/pages/home/index.tsx
import { useModel } from "@/.plugin/plugin-model";

export default function Home() {
  const { name, setName } = useModel('useHello');

  return (
    <View>{name}</View>
  );
}

```
