# redis 缓存格式

## 用户信息

用户如果点击记住我，则保存一个星期，否则一个小时  
key: sso:user:${user.id}，
value 为一个 Object json.stringfy 后的字符串  
Object 格式为：

```javascript
{
  username:string,
  active:number, //0正常，1未激活,2禁用,
  // 存入各个系统的symbol，用户sso登录的时候需要验证，也便于统一退出
  auth:[sysA-symbol,sysB-symbol],
}
```

## 第三方系统 sso 信息

时间限制：无  
key: sso:sso:${sso.symbol}  
value: JSON.stringfy({id,code,symbol,intro...})

# set cookies 格式

> uid: 用户 id,string,httpOnly  
> active: 是否正常，0 正常，1 未激活，2 禁用  
> username: 用户登录名
