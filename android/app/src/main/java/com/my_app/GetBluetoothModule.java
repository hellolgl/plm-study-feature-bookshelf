package com.my_app;

import android.app.Activity;
import android.content.Intent;
import android.widget.Toast;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class GetBluetoothModule  extends ReactContextBaseJavaModule {




  private static ReactApplicationContext reactContext;

  public GetBluetoothModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "SendBluetoothImformation";
  }

  @ReactMethod
  public void startSearchActivity(String name) {
    try{
      Activity currentActivity = getCurrentActivity();
      if(null!=currentActivity){
        Class toActivity = Class.forName(name);
        Intent intent = new Intent(currentActivity,toActivity);
//        intent.putExtra("params", params);
        //在module文件中，把参数放到intent里
        currentActivity.startActivityForResult(intent,1);
      }
    }catch(Exception e){
      throw new JSApplicationIllegalArgumentException("不能打开Activity : "+e.getMessage());
    }

  }



}