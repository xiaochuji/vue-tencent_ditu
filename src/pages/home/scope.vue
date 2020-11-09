<template>
  <div>
    <el-row class="list-wrapper">
      <div class="findList">
        <div class="find">
          <span>半径范围：</span>
          <input v-model="radius" type="text" @change="setScope" />
        </div>
      </div>
      <el-row class="sea-btns">
        <el-button size="mini" type="primary" @click="sureFn">确定</el-button>
      </el-row>
      <div id="container" style="width: 100%; height: 800px"></div>
    </el-row>
  </div>
</template>
<script>
import { updatejindu, findFirmbyid } from "@/api/home/wuzi";
import { getPunkList } from "@/api/home/second";
import url from "../../assets/bg/dw.gif";
export default {
  data() {
    return {
      longitude: 0, // 经度
      latitude: 0, // 纬度
      radius: 200,
      mapData: [],
      markerArr: [],
      userItem: {},
    };
  },
  mounted() {
    this.getAddress();
    this.getPunkLists();
  },
  methods: {
    getAddress() {
      findFirmbyid({
        id: localStorage.getItem("detid"),
      }).then((res) => {
        if (res.res) {
          this.latitude = res.list.latitude;
          this.longitude = res.list.longitude;
          this.userItem = res.list;
          if (res.list.latitude == 0 && res.list.longitude == 0) {
            this.getMyLocation();
          }
          this.radius = res.list.distance;
          // this.init()
        } else {
          this.getMyLocation();
        }
      });
    },
    getPunkLists() {
      getPunkList({
        id: localStorage.getItem("detid"),
        pageNumber: 1,
        pageSize: 10000,
      }).then((res) => {
        if (res.res) {
          this.mapData = res.list.slice(0, 50);
          this.mapData.unshift(this.userItem);
          this.init(this.mapData);
        }
      });
    },
    init(arr) {
      // 步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
      // 设置地图中心点
      var myLatlng = new qq.maps.LatLng(
        this.mapData[0].latitude,
        this.mapData[0].longitude
      );
      // 定义工厂模式函数
      var myOptions = {
        zoom: 15, // 设置地图缩放级别
        center: myLatlng, // 设置中心点样式
        mapStyleId: "style1",
        mapTypeId: qq.maps.MapTypeId.ROADMAP, // 设置地图样式详情参见MapType
      };
      // 获取dom元素添加地图信息
      var map = new qq.maps.Map(
        document.getElementById("container"),
        myOptions
      );
      if (this.mapData.length > 1) {
        arr.map((item) => {
          let marker = new qq.maps.Marker({
            position: new qq.maps.LatLng(item.latitude, item.longitude),
            map: map,
            // animation: qq.maps.MarkerAnimation.BOUNCE,
            // 将数据信息赋值给marker的data属性，用做点击显示与跳转
            data: item,
          });
          let anchor1 = new qq.maps.Point(15, 15);
          let size1 = new qq.maps.Size(30, 30);
          let origin1 = new qq.maps.Point(0, 0);
          // let url = 'https://mapapi.qq.com/web/lbs/javascriptV2/demo/img/center.gif'
          let icon1 = new qq.maps.MarkerImage(url, size1, origin1, anchor1);
          marker.setIcon(icon1);
          qq.maps.event.addListener(marker, "click", function (event) {
            this.longitude = event.latLng.getLat();
            this.latitude = event.latLng.getLng();
          });

          // 提示窗
          var info = new qq.maps.InfoWindow({
            map: map,
          });
          // 悬浮标记显示信息
          qq.maps.event.addListener(marker, "mouseover", function () {
            var center = new qq.maps.LatLng(item.latitude, item.longitude);
            info.open();
            info.setContent(
              `<div><div>姓名：${item.appUserName}</div><br /><div>部门：${item.firmName}</div><br /><div>地址：${item.upAddress}</div></div>`
            );
            info.setPosition(center);
          });
          qq.maps.event.addListener(marker, "mouseout", function () {
            info.close();
          });
          this.markerArr.push(marker);
        });
      } else {
        let that = this;
        let marker = new qq.maps.Marker({
          position: new qq.maps.LatLng(
            that.mapData[0].latitude,
            that.mapData[0].longitude
          ),
          map: map,
          // 将数据信息赋值给marker的data属性，用做点击显示与跳转
          data: that.mapData[0],
        });
        let anchor1 = new qq.maps.Point(15, 15);
        let size1 = new qq.maps.Size(30, 30);
        let origin1 = new qq.maps.Point(0, 0);
        // let url = 'https://mapapi.qq.com/web/lbs/javascriptV2/demo/img/center.gif'
        let icon1 = new qq.maps.MarkerImage(url, size1, origin1, anchor1);
        marker.setIcon(icon1);
        qq.maps.event.addListener(marker, "click", function (event) {
          that.longitude = event.latLng.getLat();
          that.latitude = event.latLng.getLng();
        });

        // 提示窗
        var info = new qq.maps.InfoWindow({
          map: map,
        });
        // 悬浮标记显示信息
        qq.maps.event.addListener(marker, "mouseover", function () {
          var center = new qq.maps.LatLng(
            that.mapData[0].latitude,
            that.mapData[0].longitude
          );
          info.open();
          info.setContent(
            `<div style="margin:10px;">姓名：${that.mapData[0].appUserName}</div><br /><div>部门：${that.mapData[0].firmName}</div><br /><div>地址：${that.mapData[0].upAddress}</div>`
          );
          info.setPosition(center);
        });
        qq.maps.event.addListener(marker, "mouseout", function () {
          info.close();
        });
        that.markerArr.push(marker);
      }
    },
    getMyLocation() {
      var geolocation = new qq.maps.Geolocation(
        "JMHBZ-MP2W6-DBSSD-ET7Q3-ZIIDJ-SRBTE",
        "水电分布"
      );
      geolocation.getLocation(this.showPosition, this.showErr);
    },
    showPosition(position) {
      this.latitude = position.lat - 0.013913;
      this.longitude = position.lng + 0.0470131;
      this.city = position.city;
      let arr = [];
      this.userItem = {
        latitude: position.lat - 0.013913,
        longitude: position.lng + 0.0470131,
        upAddress: position.city,
      };
      arr.push(this.userItem);
      this.mapData = arr;
      console.log(this.mapData)
      this.init();
    },
    showErr() {
      this.getMyLocation(); //定位失败再请求定位，测试使用
    },
    setScope() {
      this.getMyLocation();
    },
    sureFn() {
      this.getAddress();
      this.getPunkLists();
    },
  },
};
</script>
<style scoped>
@import url("../public.css");
/* 去掉input[type="number"]的默认箭头 */
.sort /deep/ input[type="number"] {
  -moz-appearance: textfield;
}
.sort /deep/ input[type="number"]::-webkit-inner-spin-button,
.sort /deep/ input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
.findList {
  width: 100%;
  display: flex;
  /* justify-content: space-between; */
}
.el-select {
  width: 60%;
}
.find {
  width: 100%;
  margin-top: 10px;
}
.find input {
  border: 1px solid #dcdfe6;
  height: 28px;
  border-radius: 4px;
  width: auto;
}
.find span {
  display: inline-block;
  width: 80px;
  text-align: right;
  font-size: 14px;
  color: #606266;
}
.bm-view {
  width: 100%;
  height: 500px;
}
</style>
