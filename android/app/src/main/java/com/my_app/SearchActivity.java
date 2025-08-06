package com.my_app;

import android.app.Activity;
import android.app.ProgressDialog;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import com.ble.support.UgBleFactory;
import com.ugee.pentabletinterfacelibrary.IUgeeBleInterface;

import java.util.ArrayList;
import java.util.List;


/**
 * Created by LCQ
 * on 2018/4/10.
 */

public class SearchActivity extends Activity implements IUgeeBleInterface {

    private Button btn_search;
    private Button btn_back;
    private ListView lv_device;
    private List<String> itemList;
    private List<BluetoothDevice> deviceList;

    private static final int SEARCH_DEVICE_TIME = 3000;//5S扫描时间
    private int nowTime = 0;
    private ArrayAdapter<String> myAdapter;

    public BluetoothDevice lastDevice = null;

    private Handler mHandler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);
        initView();
        initData();
        initListener();
    }

    private void initView(){
        btn_search = findViewById(R.id.btn_search);
        lv_device =  findViewById(R.id.lv_device);
        btn_back = findViewById(R.id.btn_back);
        itemList = new ArrayList<>();
        deviceList = new ArrayList<>();
        mHandler = new Handler();
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.i("shuju","SearchActivity onResume");
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.i("shuju","SearchActivity onResume");
    }

    private void initData(){
        //添加对应设备名 前缀
        myAdapter = new ArrayAdapter<>(SearchActivity.this,
                android.R.layout.simple_list_item_1, itemList);
        lv_device.setAdapter(myAdapter);

        runShowDialogNum = new Runnable(){
            @Override
            public void run() {
                Log.e("data","nowTime : " + nowTime);
                if (nowTime>SEARCH_DEVICE_TIME/1000){
                    disMis();
                }else{
                    nowTime++;
                    mHandler.postDelayed(runShowDialogNum,1000);
                }
            }
        };
    }

    private void initListener(){
        btn_search.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                btnOnClick();
            }
        });
        lv_device.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                lvOnClick(i);
            }
        });
        btn_back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SearchActivity.this.finish();
            }
        });
    }


    private void lvOnClick(int position){
        Intent intent = new Intent();
//        intent.setClass(this,MainActivity.class);
        intent.putExtra("deviceName",deviceList.get(position));

//        startActivity(intent);
        //设置返回数据
        SearchActivity.this.setResult(RESULT_OK, intent);
        //关闭Activity
        SearchActivity.this.finish();
    }

    private ProgressDialog mProgressDialog;
    private Runnable runShowDialogNum;
    private void showDialog(Context context){
        disMis();
        mProgressDialog = new ProgressDialog(context);
        mProgressDialog.setCancelable(true);
        mProgressDialog.setMessage(getString(R.string.searchBleDevice));
        mProgressDialog.show();
        mHandler.post(runShowDialogNum);
    }

    private void disMis(){
        if (mProgressDialog!=null){
            mProgressDialog.dismiss();
            nowTime = 0;
        }
    }


    private void btnOnClick(){
        showDialog(this);
        dataClear();
        UgBleFactory.getInstance().startScanAndTime(this,this,SEARCH_DEVICE_TIME);
    }

    private void dataClear(){
        if (deviceList!=null){
            deviceList.clear();
        }
        if (itemList!=null){
            itemList.clear();
        }
        if (myAdapter!=null){
            myAdapter.notifyDataSetChanged();
        }
    }


    @Override
    public void onGetBleDevice(final BluetoothDevice devices, int rssi, byte[] scanRecord) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {

                deviceList.add(devices);
                itemList.add(devices.getName()+" ,address : "+devices.getAddress());
                lastDevice = devices;
                myAdapter.notifyDataSetChanged();
            }
        });
    }

    @Override
    public void onGetBleStorage(String bleFlashData) {
        final String data = bleFlashData;
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(SearchActivity.this, "bleFlashData : "+data, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onGetBleFlashFlag(boolean bleFlashFlag) {
        // true 解锁成功 false  解锁失败
        final boolean flag = bleFlashFlag;
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(SearchActivity.this, "bleFlashFlag : "+flag, Toast.LENGTH_SHORT).show();
            }
        });
    }

}
