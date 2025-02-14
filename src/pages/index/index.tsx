import { View, Text , Map, Button } from '@tarojs/components'
import { useState, useEffect } from 'react';
import Taro, { useLoad } from '@tarojs/taro'
// 引入 coordtransform 库
import coordtransform from 'coordtransform';


import './index.scss'

export default function Index() {
  // 定义原始的 WGS84 坐标
  const japanRecord = [35.70254100341685, 139.6002492063651]; // 宝家牛肉店
  // const japanRecord = [35.663245, 139.753894];
  const japanTargets = [35.702948216161715, 139.60026060316517]; // 宝家周边餐饮店
  // const japanTargets = [35.67, 139.76];
  const hzRecord = [30.139205,120.077567]
  const hzTargets = [30.148198, 120.081102]
  const testRecord = hzRecord
  const testTargets = hzTargets
  const [currentLocation, setCurrentLocation] = useState({latitude: null, longitude: null, title: '当前位置'})
  const [markersList, setMarkersList] = useState([
  //   {
  //   id: 1,
  //  latitude: testRecord[0],
  //  longitude: testRecord[1],
  //  title: '西投横创商务中心',
  //   iconPath:'',
  //   callout: {
  //    content: '西投横创商务中心',
  //    padding: 10,
  //    borderRadius: 2,
  //    display: 'ALWAYS'
  //  },
  //  },
   {
     id:2,
     title: "美食",
     longitude: testTargets[1],
     latitude: testTargets[0],
     callout: {
       content: '美食',
       padding: 10,
       borderRadius: 2,
       display: 'ALWAYS'
     },
   }])

  
  // 将 WGS84 坐标转换为 GCJ-02 坐标
  const gcj02Coord = coordtransform.wgs84togcj02(japanRecord[0], japanRecord[1]);
  const markers = [
  //   {
  //   id: 1,
  //   latitude: testRecord[0],
  //   longitude: testRecord[1],
  //   title: '西投横创商务中心',
  //     iconPath:'',
  //     callout: {
  //     content: '西投横创商务中心',
  //     padding: 10,
  //     borderRadius: 2,
  //     display: 'ALWAYS'
  //   },
  //  },
   {
     id:2,
     title: "美食",
     longitude: testTargets[1],
     latitude: testTargets[0],
     callout: {
       content: '美食',
       padding: 10,
       borderRadius: 2,
       display: 'ALWAYS'
     },
   }
   ]
  // 输出转换后的 GCJ-02 坐标
  console.log('GCJ-02 坐标', gcj02Coord);
  // useEffect(() => {
  //   const list = [
  //    {
  //      id:2,
  //      title: "美食",
  //      longitude: testTargets[1],
  //      latitude: testTargets[0],
  //      callout: {
  //        content: '美食',
  //        padding: 10,
  //        borderRadius: 2,
  //        display: 'ALWAYS'
  //      },
  //    }
  //    ]
  //    setMarkersList(list)
  // }, [])
  useEffect(() => {
    if(currentLocation.longitude && currentLocation.latitude) {
      // console.log('markersList:', markersList)
      // markersList.unshift(currentLocation)
      setMarkersList([
          {
          id: 1,
         latitude: testRecord[0],
         longitude: testRecord[1],
         title: '西投横创商务中心',
          iconPath:'',
          callout: {
           content: '西投横创商务中心',
           padding: 10,
           borderRadius: 2,
           display: 'ALWAYS'
         },
         },
         {
           id:2,
           title: "美食",
           longitude: testTargets[1],
           latitude: testTargets[0],
           callout: {
             content: '美食',
             padding: 10,
             borderRadius: 2,
             display: 'ALWAYS'
           },
         }])
    }
    
  }, [currentLocation])
  useLoad(() => {
    console.log('Page loaded.')
  })
  const getLocation = async () => {
    try {
      const res = await Taro.getLocation({
        type: 'gcj02' //返回可以用于wx.openLocation的经纬度
      })
      console.log('当前位置：', res.latitude, res.longitude);
      setCurrentLocation({
        latitude: res.latitude,
        longitude: res.longitude,
        title: '西投横创商务中心',
        id:1,
        callout: {
          content: '西投横创商务中心',
          padding: 10,
          borderRadius: 2,
          display: 'ALWAYS'
        },
      })
      return res;
    } catch (err) {
      console.error('获取位置失败：', err);
    }
  }
 
  // 打开地图选择位置
  const chooseLocation = async () => {
    try {
      const res = await Taro.chooseLocation({
        latitude: japanRecord[0],  // 默认纬度
        longitude: japanRecord[1] // 默认经度
      })
      console.log('选择的位置：', res);
    } catch (err) {
      console.error('选择位置失败：', err);
    }
  }
  const openNavigation = () => {
    Taro.openLocation({
      latitude: japanTargets[0],
      longitude: japanTargets[1],
      scale: 18
    })
  }
  const handleMarkerTap = (e) => {
    const { markerId } = e.detail;
    const clickedMarker = markers.find(marker => marker.id === markerId);
    if (clickedMarker) {
      Taro.showToast({
        title: `点击了 ${clickedMarker.title}, 跳转到对应的餐厅详情`,
        icon: 'none'
      });
    }
  }

  return (
    <View className='index'>
      {/* {currentLocation.latitude ?  */}
      <Map
        id='map'
        onMarkerTap={handleMarkerTap}
        latitude={testRecord[0]}
        longitude={testRecord[1]}
        scale={14}
        markers={markersList}
        onTap={() => {console.log('map tap')}}
        style={{ width: '100%', height: '70vh' }}
      />
      {/* } */}
      <Button onClick={getLocation}>获取当前位置</Button>
      <Button onClick={chooseLocation}>选择位置</Button>
      <Button onClick={openNavigation}>导航</Button>
    </View>
  )
}
