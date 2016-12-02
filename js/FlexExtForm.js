//向某个对象添加事件
var Event={
	addListener:function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}
		else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}
		else{
			element["on"+type]=handler;
		}
	},
	removeListener:function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}
		else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}
		else{
			element["on"+type]=null;
		}
	},
	getEvent:function(event){
		return event || window.event || arguments.callee.caller.arguments[0];
	},
	getTarget:function(event){
		return  event.target||event.srcElement;
	},
	preventDefault:function(event){
		if(event.preventDefault){
			event.preventDefault();
		}
		else{
			event.returnValue=false;
		}
	}
}
////创建XMLHttpRequest对象，简称xhr对象
function creatXHR(){
	if(typeof XMLHttpRequest == 'undefined')
		XMLHttpRequest=function(){
			try{return new ActiveXObject("Msxml2.XMLHTTP.6.0");}
			catch(e){}
			try{return new ActiveXObject("Msxml2.XMLHTTP.3.0");}
			catch(e){}
			try{return new ActiveXObject("Msxml2.XMLHTTP");}
			catch(e){}
			return false;
		}
		return new XMLHttpRequest();
}
//最大程度优化元素获取
function getElement(obj,select,dynamic){
	var  doc=document,
		elem=null,
		flag=select.charAt(0);
	if(flag==='#'){
		if(doc.querySelector&&dynamic==false){
			elem=obj.querySelector(select);
		}
		else{
			elem=obj.getElementById(select.slice(1));
		}
	}
	if(flag==='.'){
		if(doc.querySelectorAll&&dynamic==false){
			elem=obj.querySelectorAll(select);
		}
		else{
			if(doc.getElementsByClassName){
				elem=obj.getElementsByClassName(select.slice(1));
			}
			else{
				var AllElem=doc.getElementsByTagName('*'),
					result=[];
				for(var i=0,max=AllElem.length;i<max;i++){
					if(AllElem[i].className==select.slice(1)){
						result.push(AllElem[i]);
					}
				}
				elem=result;
			}
		}
	}
	if(flag!='.'&&select.charAt(0)!='#'){
		if(doc.querySelectorAll&&dynamic==false){
			elem=obj.querySelectorAll(select);
		}
		else{
			elem=obj.getElementsByTagName(select);
		}
	}
	return elem;
}


var createForm=(function createForm(){
	var Form={},
		id=null,
		doc=document,
		callback=null,
		sumbit,
		forms,
		URL,
		formObj=null;
	function FormVerify(formInf,URL){
			this.Id=formInf.ID;
			this.Type=formInf.Type;
			this.pattern=formInf.Pattern;
			this.input=getElement(doc,'#'+formInf.ID,false);
			this.value=this.input.value;
			this.mask=1;
			this.flag=1;
			this.URL=URL;
			this.ajax=formInf.Ajax;
	}
	FormVerify.prototype={
			constructor:FormVerify,
			SayWarn:function(){
				this.value=this.input.value;
				if(this.mask==1){
					if(this.value){
						if(this.pattern==' '||this.pattern.test(this.value)){
							callback(0,this.Type);
							this.flag=1;
						}
						else{
							callback(10,this.Type);	
							this.flag=0;		
						}
					}
					else{
						callback(11,this.Type);
						this.flag=0;	
					}
				}
			},
			FormAjax:function(){
				var xhr=creatXHR();
				if(xhr){
					var URL=this.URL,
						that=this;
					xhr.onreadystatechange=function(){
						if (xhr.readyState==4){
							if ((xhr.status>=200&&xhr.status<300)||xhr.status==304) {
								that.mask=parseInt(xhr.responseText);
								if(that.mask==0){
									callback(13,this.Type);
									that.flag=0;
									that.mask=1;
								}
								else{
									callback(14,this.Type);
									that.flag=1;
									that.mask=0;
								}
							}
							else{
								callback(2,this.Type);
							}
						}
					};
					this.value=this.input.value;
					URL=encodeURI(URL+"?Value="+this.value+"&Type="+this.Id+"&sid="+Math.random());
					xhr.open("GET",URL,true);
					xhr.send(null);
				}		
			},
			sameWarn:function(){
				if(this.Id.indexOf("repeat")==0){
					 var key=getElement(doc,"#"+this.Id.replace(/^repeat/,''),false);
					 if(this.input.value!=key.value){
					 	callback(12,this.Type);
					 	this.flag=0;
					 }
					 else{
					 	callback(0,this.Type);
					 }
				}
			}	
	}
	//处理提交
	function handlerSumbit(){
			var count=0,
				t=0,
				i;
			for(i in Form){
				Form[i].SayWarn();
				if(i.indexOf('repeat')==0){
							Form[i].sameWarn();
				}
				count=count+Form[i].flag;
				++t;
			}
			if(count==t){
				AjaxSumbit('Form',URL,Form,callback);//表单异步提交的URL
			}
			else{
				callback(15);
			}
	}
	// id-对应表单的id ,URL异步请求的URL，callback异步提交数据成功后的回调函数
	function AjaxSumbit(id,URL,Form,success,fail){
			var xhr=creatXHR(),
				flag=1;
			xhr.onreadystatechange=function(){
				if(xhr.readyState<=1){
					uploading(sumbit);
				}
				if (xhr.readyState==4){
					if ((xhr.status>=200&&xhr.status<300)||xhr.status==304) {
						var flag=xhr.responseText;	
						sumbit.innerHTML='提交数据';
						sumbit.setAttribute('switch','on');
						if (flag){
							callback(4,this.Type);
						}
						else{
							callback(3,this.Type);
						}
					}
					else{
						sumbit.setAttribute('switch','on');
						sumbit.innerHTML='提交';
						callback(2,this.Type);
					}
				}
			};
			xhr.open("post",URL,true);
			var data=CreateData(id);
			xhr.send(data);
	}
	function formSerialize(){
		var result=[],
			field,
			option,
			ovalue,
			t;
		for(var i=0,len=formObj.elements.length;i<len;i++){
			field=formObj.elements[i];
			switch(field.type){
				case "button":
				case "submit":
				case "file":
				case "reset":
				case "image":
						break;
				case "select":
				case "select-multiple":
					if(field.name.length){
						for(t=0,olen=field.options.length;t<olen;t++){
							option=field.options[t];
							if(option.selected){
								ovalue='';
								if(option.hasAttribute){
									ovalue=option.hasAttribute("value")?option.value:option.text;
								}
								else{
									ovalue=option.attribute("value").specified?option.value:option.text;
								}
								result.push(encodeURIComponent(field.name)+"="+encodeURIComponent(ovalue));
							}
						}
					}
					break;
				case "radio":
				case "checkbox":
					if(!field.checked){
						break;
					}
				default:
					result.push(encodeURIComponent(field.name)+"="+encodeURIComponent(ovalue));
			}
		}
		return result.join("&");
	}
	function CreateData(id){
			var data=null;
			data=new FormData(formObj)
			if(!data){
				data=formSerialize();
			}
			return data;
	}
	var controlPattern={
			click:function(){
				Event.addListener(sumbit,'click',function(){
					if(sumbit.getAttribute('switch')=='on'){	
						handlerSumbit();
					}
				});
			},
			keydown:function(){
				Event.addListener(window,'keydown',function(event){
					var e =Event.getEvent(event);
					if(e.keyCode==13){
						handlerSumbit();
					}
				});
			},
			touch:function(){
				Event.addListener(sumbit,'touchstart',function(){
					if(sumbit.getAttribute('switch')=='on'){	
						handlerSumbit();
					}
				});
			},
			change:function(){
				Event.addListener(forms,'change',function(event){
					var event=Event.getEvent(event),
						target=Event.getTarget(event),
						name=target.name;
					if(Form[name]){
						if(name.indexOf('repeat')==0){
							Form[name].sameWarn();
						}
						Form[name].SayWarn();
						if(Form[name].ajax){
							Form[name].FormAjax();
						}
					}
				});
			}
	}
	function controlEvent(controls){
		for(var i=0,len=controls.length;i<len;i++){
			controlPattern[controls[i]]();
		}
	}
	// 自定义正在上传数据时执行的函数
	function uploading(sumbit){
		sumbit.innerHTML='正在提交数据';
		sumbit.setAttribute('switch','off');
	}
	return function(infs,Callback,controls,id,Url){
		var len=infs.length;
		URL=Url;
		for(var i=0;i<len;i++){
			var inf=infs[i];
				form=new FormVerify({
				ID:inf.id,
				Type:inf.type,
				Pattern:inf.pattern,
				Ajax:inf.ajax
			},URL);
			Form[inf.id]=form;
		}
		sumbit=getElement(doc,'#'+id+'_sumbit',true);
		forms=getElement(doc,'#'+id,true);
		sumbit.setAttribute("switch","on");
		id=id;
		controlEvent(controls);
		callback=Callback;
		formObj=doc.getElementById(id)
	};
})();
