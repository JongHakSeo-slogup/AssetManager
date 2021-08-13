# AssetManager 사용방법
폴더 구조는
- src / assets
- src / assetManager

형태로 위치한다고 가정한다.

AssetManager 사용을 위해 package.json 파일을 수정한다.
```json
"scripts" : {
  "start" : "yarn assets & react-script start",
  "assets" : "node src/assetManager/start.js src/assets",
},
```

에셋폴더 이름이 다르거나, 하위 폴더만 적용시키고 싶다면, assets 스크립트 뒤 인자인 'src/assets' 경로를 수정해주면 된다.( 단 src/ 경로는 필수)

assets 폴더 내 파일의 변경사항이 있으면, 자동으로 감지 후 fileInfo.json 파일이 업데이트 된다.

코드 내에서 리소스를 import 할 경우에는 assets 객체에 있는 리소스들을 호출해서 사용하면 된다.

```javascript
import {assets} from "../../assetManager";

const Component = () => {
 return <img src={assets.IMAGE_LOGO} />
}
```

> made by ryan
