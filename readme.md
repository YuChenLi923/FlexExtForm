# FlexExtForm
FlexExtForm是一个基于javascript编写的工具，能够灵活地处理表单的传输与认证，当前版本1.0.3

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

	creatForm([form fields],callback,[controls],formId,submitId,postURL,getURL,isSumbit)

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

- callback(flag,name,responseText)

回调函数，这个函数会接受表单验证或提交过程中的标志信息，接受到不同的标志信息反映了当前表单验证或者提交时的情况。同时它也会接受某个表单字段的名称（name），当成功向服务器提交数据时,responseText会获得服务器返回的数据。可能出现的flag值如下：

	-  0 某个表单字段数据信息检验合法,表单数据未提交。
	-  1 某个表单字段数据某些信息不合法,表单数据未提交。
	-  2 某个表单字段数据某些信息为空(此时出现错误的表单字段的pattern为' '，表示不允许为空),表单数据未提交。
	-  3 异步检测，服务器成功返回数据
	-  4 异步检测，服务器返回数据失败
	-  5 某个表单字段数据某些信息不相同(例如：密码与重复密码字段),表单数据未提交。
	-  6 某个表单字段数据某些信息相同(例如：密码与重复密码字段),表单数据未提交。
	-  7 表单数据被提交时
	-  8 表单数据提交服务器成功
	-  9 表单数据提交服务器失败



- controls
字符串数组,设置提交按钮以及表单验证的控制器，含有以下选项:

    - click 点击触发
    - keydown 按回车触发
    - touch 触摸屏触碰触发
    - change 表单字段信息发生改变时，验证表单字段信息是否合法。

- formId   form元素对应的id
- submitId 提交按钮对应的id
- postURL  提交表单数据时服务器的URL
- getURL   检验提交数据的服务器URL
- isSumbit 布尔值or函数(这个函数返回布尔值) 设置提交按钮是否有效

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
		,callback,['click','keydown','touch','change'],'Form','Form_sumbit','php/Form_Ajax.php');
		function callback(flag,name){
			console.log(flag,name);
		}

```
,
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
		,callback,['click','keydown','touch','change'],'Form','Form_sumbit','php/Form.php','php/Form_Ajax.php');
		function callback(flag,name){
			console.log(flag,name);
		}
	</script>
	</body>
</html>


```
