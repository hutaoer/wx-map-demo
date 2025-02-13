import { View, Text , Map, Button } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
// 引入 coordtransform 库
import coordtransform from 'coordtransform';


import './index.scss'

export default function Index() {
  // 定义原始的 WGS84 坐标
  const wgs84Coord = [35.663245, 139.753894];

  // 将 WGS84 坐标转换为 GCJ-02 坐标
  const gcj02Coord = coordtransform.wgs84togcj02(wgs84Coord[0], wgs84Coord[1]);

  // 输出转换后的 GCJ-02 坐标
  console.log('GCJ-02 坐标', gcj02Coord);
  useLoad(() => {
    console.log('Page loaded.')
  })
  const getLocation = async () => {
    try {
      const res = await Taro.getLocation({
        type: 'gcj02' //返回可以用于wx.openLocation的经纬度
      })
      console.log('当前位置：', res.latitude, res.longitude);
      return res;
    } catch (err) {
      console.error('获取位置失败：', err);
    }
  }
 
  // 打开地图选择位置
  const chooseLocation = async () => {
    try {
      const res = await Taro.chooseLocation({
        latitude: wgs84Coord[0],  // 默认纬度
        longitude: wgs84Coord[1] // 默认经度
      })
      console.log('选择的位置：', res);
    } catch (err) {
      console.error('选择位置失败：', err);
    }
  }

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      <Map
        id='map'
        longitude={139.753894}
        latitude={35.663245}
        // longitude={120}
        // latitude={120}
        scale={16}
      //   markers={[{
      //    id: 1,
      //    latitude: 120,
      //    longitude: 120,
      //    name: '位置',
      //    width: 400,
      //    height: 600
      //  }]}
        onTap={() => {console.log('map tap')}}
        style={{ width: '100%', height: '300px' }}
      />
      <Button onClick={getLocation}>获取当前位置</Button>
      <Button onClick={chooseLocation}>选择位置</Button>
    </View>
  )
}
