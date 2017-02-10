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
	getEvent:function(event){
		return event || window.event || arguments.callee.caller.arguments[0];
	},
	getTarget:function(event){
		return  event.target||event.srcElement;
	}
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
