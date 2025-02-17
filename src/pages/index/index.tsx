import { View, Text , Map, Button } from '@tarojs/components'
import { useState, useEffect } from 'react';
import Taro, { useLoad } from '@tarojs/taro'
// 引入 coordtransform 库
import coordtransform from 'coordtransform';
// import QQMapWX from 'qqmap-wx-jssdk';
import QQMapWX from '@/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js';

import './index.scss'

const markerWidth = 15
const markerHeight = 20
const markerPadding = 5
const markerBorderRadius = 2
// mock data
// 当前位置信息, id默认为1
const hzCurrentInfo = {
  id:1,
  // 纬度 
  latitude: 30.139205, 
  // 经度
  longitude: 120.077567, 
  title: '当前位置',
  width: markerWidth,
  height: markerHeight,
  iconPath:'',
  callout: {
     content: '当前位置',
     padding: markerPadding,
     borderRadius: markerBorderRadius,
     display: 'ALWAYS'
  },
} 

// 杭州目标餐厅，id默认为2
const hzTargetInfo = {
  id:2,
  latitude: 30.148198,
  longitude: 120.081102,
  title: '杭州餐厅1',
  iconPath:'',
  width: markerWidth,
  height: markerHeight,
  callout: {
     content: '杭州餐厅1',
     padding: markerPadding,
     borderRadius: markerBorderRadius,
     display: 'ALWAYS'
  }, 
}

// 杭州周边餐厅信息
const hzOtherMarkers = [{
  id:3,
  latitude: 30.138198,
  longitude: 120.091102,
  title: '杭州餐厅2',
  iconPath:'',
  width: markerWidth,
  height: markerHeight,
  callout: {
     content: '杭州餐厅2',
     padding: markerPadding,
     borderRadius: markerBorderRadius,
     display: 'ALWAYS'
  }, 
}]

// 当前日本位置信息
const jpCurrentInfo = {
  // 纬度 
  latitude: 35.70254100341685, 
  // 经度
  longitude: 139.6002492063651, 
  title: '日本当前位置',
  callout: {
    content: '日本当前位置',
    padding: 10,
    borderRadius: 2,
    display: 'ALWAYS'
 },
} 
// 日本目标餐厅
const jpTargetInfo = {
  latitude: 35.702948216161715,
  longitude: 139.60026060316517,
  title: '日本餐厅1',
  iconPath:'',
  callout: {
     content: '日本餐厅1',
     padding: 10,
     borderRadius: 2,
     display: 'ALWAYS'
  }, 
}

export default function Index() {
  // 定义原始的 WGS84 坐标
  const japanRecord = [35.70254100341685, 139.6002492063651]; // 宝家牛肉店
  // const japanRecord = [35.663245, 139.753894];
  const japanTargets = [35.702948216161715, 139.60026060316517]; // 宝家周边餐饮店
  // const japanTargets = [35.67, 139.76];
  const hzRecord = [30.139205, 120.077567]
  const hzTargets = [30.148198, 120.081102]
  const testRecord = hzRecord
  const testTargets = hzTargets
  const [currentLocation, setCurrentLocation] = useState(hzCurrentInfo)
  const [markersList, setMarkersList] = useState(hzOtherMarkers)
   const [polyline, setPolyline] = useState<any[]>([]);
   const qqmapsdk = new QQMapWX({
    key: 'YRFBZ-JV262-WQAUY-CR4PV-GIYEF-K2BMD'
  });

  // 已进入页面的时候就获取当前位置
  useEffect(() => {
    getCurrentPosition()
  }, [])

  const getCurrentPosition = async () => {
    try {
      const res = await Taro.getLocation({
        type: 'gcj02' //返回可以用于wx.openLocation的经纬度
      })
      console.log('当前位置：', res.latitude, res.longitude);
      setCurrentLocation({
        ...currentLocation,
        latitude: res.latitude,
        longitude: res.longitude,
      })
      // 拼接所有的markers
      const allList = [currentLocation, hzTargetInfo].concat(markersList)
      // tmpList.unshift(currentLocation)
      setMarkersList(allList)
      getRoute(allList)
    } catch (err) {
      console.error('获取当前位置失败：', err);
    }
  }
  
  // 将 WGS84 坐标转换为 GCJ-02 坐标
  // const gcj02Coord = coordtransform.wgs84togcj02(japanRecord[0], japanRecord[1]);
  const markers = [
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
   }
   ]
 
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

  const getRoute = (list:any, mode:string) => {
    if(!list) {
      list = markersList
    }
    if(!mode) {
      mode = 'driving'
    }
    if(list.length > 1) {
      // 确定当前坐标和目标坐标存在
      if(list[0].id === 1 && list[1].id === 2) {
        qqmapsdk.direction({
          mode: 'driving', // 驾车模式
          from: `${list[0].latitude},${list[0].longitude}`,
          to: `${list[1].latitude},${list[1].longitude}`,
          success: (res: any) => {
            const ret = res.result.routes[0];
            const points = [];
            if (ret.polyline && ret.polyline.length > 0) {
              for (let i = 2; i < ret.polyline.length; i++) {
                ret.polyline[i] = ret.polyline[i - 2] + ret.polyline[i] / 1000000;
              }
              for (let i = 0; i < ret.polyline.length; i += 2) {
                points.push({
                  longitude: ret.polyline[i + 1],
                  latitude: ret.polyline[i]
                });
              }
            }
            setPolyline([
              {
                points: points,
                color: '#0093FF',
                width: 6
              }
            ]);
          },
          fail: (err: any) => {
            console.log('fail', err)
            console.error('路线规划失败:', err);
            Taro.showToast(err)
          }
        });
      } else {
        console.error('坐标信息获取有误')
      }
    } else {
      console.error('坐标信息获取有误')
    }
  };
  const getCurrentLocation = () => {
    getRoute(undefined, 'walking')
  }

  const changeTransportType = () => {
    getCurrentLocation()
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
        polyline={polyline}
        markers={markersList}
        onTap={() => {console.log('map tap')}}
        style={{ width: '100%', height: '70vh' }}
      />
      {/* } */}
      {/* <Button onClick={getCurrentLocation}>获取当前位置</Button> */}
      <Button onClick={openNavigation}>导航前往</Button>
      {/* <Button onClick={changeTransportType}>切换交通方式</Button> */}
    </View>
  )
}
