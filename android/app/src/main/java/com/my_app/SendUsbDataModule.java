package com.my_app;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.List;

import androidx.annotation.NonNull;

public class SendUsbDataModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;    //必须定义

    public SendUsbDataModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext=reactContext;
    }

    // 自定义方法
    public static void sendUsbData(int x,int y,int strokeWidth){
        WritableMap eventValue=new WritableNativeMap();
//        WritableArray array = Arguments.createArray();
//        array.pushDouble(param);
        eventValue.putInt("usbCanvasDataX",x);
        eventValue.putInt("usbCanvasDataY",y);
        eventValue.putInt("usbCanvasDataPressure",strokeWidth);
        if(reactContext!=null){
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("usbData",eventValue);
        }
    }

    // 自定义方法
    public static void sendUsbDatas(WritableArray x,WritableArray y){
        WritableMap eventValue=new WritableNativeMap();
//        WritableArray array = Arguments.createArray();
//        array.pushDouble(param);
        eventValue.putArray("usbCanvasDataX",x);
        eventValue.putArray("usbCanvasDataY",y);
        if(reactContext!=null){
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("usbData",eventValue);
        }
    }


    @NonNull
    @Override
    public String getName() {
        return "SendUsbDataModule";
    }
}
