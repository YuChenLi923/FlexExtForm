# FlexExtForm
FlexExtForm是一个基于javascript编写的工具，能够灵活地处理表单的传输与认证，当前版本1.0.0

## 使用说明
FlexExtForm的使用非常便利，只需要下面这几步

### 一、按规范设定HTML

- 将表单字段放入指定id的<form>标签中，FlexExtForm只对在<form>里面的表单字段有效,并且form标签必须设定id。
- 表单必须要有一个提交按钮，并且这个提交按钮的id要设置为对应form标签的id+'_sumbit',并且需要添加一个自定义属性switch,值为'on'。

例如:

``` html
	<form id='Form'>
	</form>
	<button id='Form_submit' switch='on'></button>
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
	- 2  上传服务器的时候出错。
	- 3	 全部表单数据经服务器检测后某些信息不合法。
	- 4  数据提交成功

- controls
字符串数组,设置提交按钮以及表单验证的控制器，含有以下选项:

- click 点击触发
- keydown 按回车触发
- touch 触摸屏触碰触发
- change 表单字段信息发生改变时，验证表单字段信息是否合法。

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
		<script type="text/javascript" src="js/commonFunction.js"></script>
	</head>
	<body>
	<form id='Form' onsubmit="return false" >
		<input id='Key' type="password" name="Key"></input>
		<input id='repeatKey' type="password" name="repeatKey"></input>
		<input id='companyName' type="text" name="companyName"></input>
	</form>
	<button id='Form_sumbit' switch='on'>提交数据</button>
	<script type="text/javascript" src="js/FormSub.js"></script>
	<script type="text/javascript">
		createForm(
			[	
				
				{
					id:'Key',
					type:'密码',
					pattern:' '
				},
				{
					id:'repeatKey',
					type:'重复密码',
					pattern:' '
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

## 版本更新

0.1.0
- 增加了表单验证功能


0.1.1 
- 增加了AJAX数据提交功能（PHP，不支持文件异步传输）
- 增加回车提交事件

0.2.0
- 增加了异步文件传输功能（目前仅兼容IE10+,Opera 12+,Safari 5+,Chorme 7+）
- 增加了验证时出现错误反馈的字符串变量

0.2.1

- 优化了数据结构，能够更方便地添加数据
- 形成了闭包

0.2.2

- 修复确认密码字段的验证问题
- 禁止反复提交表单数据	
- 增加正在提交的提示

0.3.0

- 增加自定义注册失败的函数
- 增加自定义注册成功的函数
- 增加自定义数据上传时执行的函数

1.0.0

- 取消以前添加表单字段实例的方式，改为使用createForm()
- 删除了所以的自定义函数，改为一个回调函数
- 删除表单认证的提示功能，现在需要在回调函数里面自定义提示效果。
- 取消了FormVerify的URL属性。现在每个表单字段实例都享有共有的URL。
- 增加控制器选项，方便扩展。

使用方法：
仿照index.html和creatForm.js里面即可