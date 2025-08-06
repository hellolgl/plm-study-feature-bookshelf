package com.my_app;

import com.ble.support.UgBleFactory;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import com.my_app.GetBluetoothModule;
import com.ugee.pentabletinterfacelibrary.IBleUsbDataReturnInterface;
import com.ugee.pentabletinterfacelibrary.IUgeeBleInterface;

import java.util.ArrayList;
import java.util.List;

import android.Manifest;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
// import com.umeng.analytics.MobclickAgent;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity implements IBleUsbDataReturnInterface {


  private static BluetoothDevice bleDevice;
  private static int dMaxX = 50800,dMaxY = 30480,dMaxPressure = 8191;
  private double lastX=0,lastY=0;
  private WritableArray arrayX = new WritableNativeArray();
  private WritableArray arrayY = new WritableNativeArray();

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "my_app";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }


  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Log.e("MainActivity","MainActivity Oncreate");
//     MobclickAgent.setSessionContinueMillis(1000*40);
    SplashScreen.show(this);
  }

  @Override
  protected void onResume() {
    super.onResume();
    Log.e("MainActivity","MainActivity onResume");
//     MobclickAgent.onResume(this);
//    Toast.makeText(this, "MainActivity : onResume", Toast.LENGTH_SHORT).show();
  }

  @Override
  protected void onPause() {
    super.onPause();
//     MobclickAgent.onPause(this);
//    Toast.makeText(this, "MainActivity : onPause", Toast.LENGTH_SHORT).show();
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
//    Toast.makeText(this, "MainActivity : onDestroy", Toast.LENGTH_SHORT).show();
    Log.e("MainActivity","MainActivity onDestroy");
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    initData(data);
    connectShow();
  }

  @Override
  public void onGetBleUsbDataReturn( byte bleButton, int bleX, int bleY, short blePressure) {

    int usbX, usbY;
    int strokeWidth = (int)(blePressure * 5 / dMaxPressure);//2047;
    usbX = (int)(bleX * 800 / dMaxX);
    usbY = (int)(bleY * 500 / dMaxY);
    SendUsbDataModule.sendUsbData(usbX,usbY,strokeWidth);

  }

  @Override
  public void onGetBleUsbSolfKeyBroad(byte b, int i, int i1) {

  }

  @Override
  public void onGetBleUsbHardKeyBroad(byte b, int i, int i1) {

  }

  @Override
  public void onGetBleUsbScreenMax(int rc, int maxX, int maxY, int maxButton, int maxPressure) {
      //横屏
      dMaxX = maxX ;
      dMaxY = maxY ;
      dMaxPressure = maxPressure;

  }

  @Override
  public void onGetBleUsbConnectType(int i) {

  }

  @Override
  public void onGetBleUsbBatteryLevel(String s) {

  }

  private void initData(Intent data){
//    Intent intent = getIntent();
    if (data!=null && data.getParcelableExtra("deviceName") != null){
      bleDevice = data.getParcelableExtra("deviceName");
    }else {
      // Toast.makeText(this, "intent : null", Toast.LENGTH_SHORT).show();
    }
  }

  private void connectShow(){
    if (bleDevice!=null){
      UgBleFactory.getInstance().connect(MainActivity.this,bleDevice,MainActivity.this);
    }else {
      // Toast.makeText(this, "bleDevice : null", Toast.LENGTH_SHORT).show();
    }
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    switch (requestCode){
      case 200://刚才的识别码
        if(grantResults[0] == PackageManager.PERMISSION_GRANTED){//用户同意权限,执行我们的操作
          Toast.makeText(MainActivity.this,"已开启定位权限",Toast.LENGTH_LONG).show();
        }else{//用户拒绝之后,当然我们也可以弹出一个窗口,直接跳转到系统设置页面
          Toast.makeText(MainActivity.this,"未开启定位权限,请手动到设置去开启权限",Toast.LENGTH_LONG).show();
        }
        break;
      case 201:
        if(grantResults[0] == PackageManager.PERMISSION_GRANTED){//用户同意权限,执行我们的操作
          Toast.makeText(MainActivity.this,"已开启录音权限",Toast.LENGTH_LONG).show();
        }else{//用户拒绝之后,当然我们也可以弹出一个窗口,直接跳转到系统设置页面
          Toast.makeText(MainActivity.this,"未开启录音权限,请手动到设置去开启权限",Toast.LENGTH_LONG).show();
        }
        break;
      default:break;
    }

  }
}
