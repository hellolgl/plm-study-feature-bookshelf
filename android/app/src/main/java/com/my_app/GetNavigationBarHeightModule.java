package com.my_app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.lang.reflect.Method;
import java.util.Map;
import java.util.HashMap;

import androidx.annotation.NonNull;

public class GetNavigationBarHeightModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;    //必须定义

    public GetNavigationBarHeightModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext=reactContext;
    }

    //获取是否存在NavigationBar
    public  boolean checkDeviceHasNavigationBar(Context context) {
        boolean hasNavigationBar = false;
        Resources rs = context.getResources();
        int id = rs.getIdentifier("config_showNavigationBar", "bool", "android");
        if (id > 0) {
            hasNavigationBar = rs.getBoolean(id);
        }
        try {
            Class systemPropertiesClass = Class.forName("android.os.SystemProperties");
            Method m = systemPropertiesClass.getMethod("get", String.class);
            String navBarOverride = (String) m.invoke(systemPropertiesClass, "qemu.hw.mainkeys");
            if ("1".equals(navBarOverride)) {
                Log.e("hasNavigationBar","false");
                hasNavigationBar = false;
            } else if ("0".equals(navBarOverride)) {
                Log.e("hasNavigationBar","true");
                hasNavigationBar = true;
            }
        } catch (Exception e) {
        }
        return hasNavigationBar;
    }

    @ReactMethod
    public void getNavigationBarHeight() {
        int result = 0;
        Activity currentActivity = getCurrentActivity();
        Log.e("getNavigationBarHeight","getNavigationBarHeight start");
        if (checkDeviceHasNavigationBar(currentActivity)) {
            Resources res = currentActivity.getResources();
            int resourceId = res.getIdentifier("navigation_bar_height", "dimen", "android");
            if (resourceId > 0) {
                result = res.getDimensionPixelSize(resourceId);
            }
        }
        sendNavigationBarHeight(result,checkDeviceHasNavigationBar(currentActivity));
    }

    // 自定义方法
    private  void sendNavigationBarHeight(int navigationBarHeight,boolean isHave){
        String s=String.valueOf(navigationBarHeight);
        int isHaveInt = isHave ? 1 : 0;
        Log.e("sendNavigationBarHeight",s);
        WritableMap eventValue=new WritableNativeMap();
        eventValue.putInt("navigationBarHeight",navigationBarHeight);
        eventValue.putInt("isHavenavigationBarHeight",isHaveInt);
        if(reactContext!=null){
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("navigationBarHeight",eventValue);
        }
    }


    @NonNull
    @Override
    public String getName() {
        return "GetNavigationBarHeightModule";
    }
}
