# FlexExtForm
基于js，用于表单的数据的传输和检验，当前版本1.0.3

## 快速开始

FlexExtForm的使用非常便利，只需要下面这几步

### 一、按规范设定HTML

- 将表单字段放入指定id的<form>标签中，FlexExtForm只对在<form>里面的表单字段有效,并且form标签必须设定id。

例如:

``` html
	<form id='Form'>
	</form>
	<button id='Form_submit'></button>
```
- 所以的表单字段必须要有相同的名字的id和name属性，否则FlexExtForm无法生效，甚至会报错。
- 如要存在类似于密码与重复密码的表单字段，需要将重复密码的表单字段的id设置为'repeat'+密码字段的id，否则无法检验。

例如:

``` html

	<input id='Key' type="password" name="Key"></input>
	<input id='repeatKey' type="password" name="repeatKey"></input>

```

### 二、使用creatForm函数

``` js
	
	creatForm([form fields],callback,[controls],id,url)

```
参数说明：

- [form fields] 

对象数组，数组中的每个元素均是表单字段对象。这个对象需按下面的示例填写:

``` js
	{
		id:'Key',//对应表单字段的id
		type:'密码',//对应表单字段的名字
		pattern:' ',//该表单字段应用的正则表达式
		ajax:false//布尔值,该表单字段是否支持异步检测(上传至服务器检测，在点击提交按钮之前)
	},

```

- callback(flag,name)

回调函数，这个函数会接受表单验证或提交过程中的标志信息，接受到不同的标志信息反映了当前表单验证或者提交时的情况。同时它也会接受某个表单字段的名称。可能出现的flag值如下：
	
	-  0 某个表单字段数据信息检验合法,表单数据未提交。
	- 10 某个表单字段数据某些信息不合法,表单数据未提交。
	- 11 某个表单字段数据某些信息为空(此时出现错误的表单字段的pattern为' '，表示不允许为空),表单数据未提交。
	- 12 某个表单字段数据某些信息不相同(例如：密码与重复密码字段),表单数据未提交。
	- 13 某个表单字段数据信息检验合法，该表单字段表单数经据服务器检验后为非法(例如：重复的用户名),表单数据未提交。
	- 14 某个表单字段数据信息检验合法，该表单字段表单数经据服务器检验后正确(例如：没有重复的用户名),表单数据未提交。
	- 15 整个表单数据信息未通过客户端检验(点击提交按钮的时候未通过，此时不会向服务器发生信息)
	- 2  上传服务器的时候出错。
	- 3	 全部表单数据经服务器检测后某些信息不合法。
	- 4  数据提交成功

- controls
字符串数组,设置提交按钮以及表单验证的控制器，含有以下选项:

- click 点击触发
- keydown 按回车触发
- touch 触摸屏触碰触发
- change 表单字段信息发生改变时，验证表单字段信息是否合法。

### 三、后台响应信息

如果后台检测数据合法或者是成功将数据传入数据则反馈一个'1'，否则反馈'0'

#### 示例

``` js
	
	createForm(
			[	
				
				{
					id:'Key',
					type:'密码',
					pattern:' ',
					ajax:false
				},
				{
					id:'repeatKey',
					type:'重复密码',
					pattern:' ',
					ajax:false
				}
			]
		,callback,['click','keydown','touch','change'],'Form',' ');
		function callback(flag,name){
			console.log(flag,name);
		}

```

### 完整代码示例

``` html

<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8;">
		<title>表单验证与提交</title>
	</head>
	<body>
	<form id='Form' onsubmit="return false" >
		<input id='Key' type="password" name="Key"></input>
		<input id='repeatKey' type="password" name="repeatKey"></input>
		<input id='companyName' type="text" name="companyName"></input>
	</form>
	<button id='Form_sumbit' switch='on'>提交数据</button>
	<script type="text/javascript" src="js/ajaxExpand.min.js"></script>
	<script type="text/javascript" src="js/FlexExtForm.min.js"></script>
	<script type="text/javascript">
		createForm(
			[	
				{
					id:'Key',
					type:'密码',
					pattern:' ',
					ajax:false
				},
				{
					id:'repeatKey',
					type:'重复密码',
					pattern:' ',
					ajax:false
				}
			]
		,callback,['click','keydown','touch','change'],'Form',' ');
		function callback(flag,name){
			console.log(flag,name);
		}
	</script>
	</body>
</html>


```
