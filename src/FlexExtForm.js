var createForm=(function createForm(){
	var formObjs={},
		form=null,
		doc=document,
		callback=null,
		sumbit,
		post_url,
		get_url,
		formObj=null,
		isSumbits=null,
		Event={
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
		};
	function FormVerify(formInf,URL){
		this.Id=formInf.ID;
		this.Type=formInf.Type;
		this.pattern=formInf.Pattern;
		this.input=doc.getElementById(formInf.ID);
		this.value=this.input.value;
		this.mask=0;
		this.flag=1;
		this.URL=URL;
		this.ajax=formInf.Ajax;
	}
	FormVerify.prototype={
		constructor:FormVerify,
		SayWarn:function(){
			this.value=this.input.value;
			if(this.value){
				if(this.pattern==' '||this.pattern.test(this.value)){
					callback(0,this.Type);
					if(!this.ajax)
						this.flag=1;
					this.mask=1;
				}
				else{
					callback(1,this.Type);
					this.flag=0;
					this.mask=0;
				}
			}
			else{
				callback(2,this.Type);
				this.flag=0;
			}
		},
		FormAjax:function(){
			var URL=this.URL,
				that=this;
			ajaxExpanding.init({
                name:'form_ajax',
				type:'get',
				async:'true',
				contentType:'text',
				accept:"text",
				charset:"utf-8"
			});
			if(this.mask==1){
				ajaxExpanding.send({
					url:get_url,
					data:{
						Value:this.value,
						Type:this.Id
					},
					onSuccess:function(responseText){
						callback(3,this.Type,responseText)
					},
					onFail:function(){
						callback(4,that.Type);
					}
				},'form_ajax',this)
				this.mask=0;
			}
		},
		sameWarn:function(){
			if(this.Id.indexOf("repeat")==0){
				var key=doc.getElementById(this.Id.replace(/^repeat/,''));
				if(this.input.value!=key.value){
					callback(5,this.Type);
					this.flag=0;
				}
				else{
					callback(6,this.Type);
				}
			}
		}
	}
	//处理提交
	function handlerSumbit(){
		var count=0,
			t=0,
			i;
		callback(7);
		AjaxSumbit(form,post_url,Form,callback);//表单异步提交的URL
	}
	// id-对应表单的id ,URL异步请求的URL，callback异步提交数据成功后的回调函数
	function AjaxSumbit(form,URL,Form,success,fail){
		var flag=1;
		ajaxExpanding.send({
			url:post_url,
			data:form,
			onSuccess:function(responseText){
				callback(8,this.Type,responseText);
			},
			onError:function(){
				callback(9,this.Type);
			},
            onfileUpCallback:function () {
            	callback(10,this.Type);
            }
		},'form',this)
	}
	var controlPattern={
		click:function(){
			Event.addListener(sumbit,'click',function(){
				if(isSumbits||isSumbits==null)
					handlerSumbit();
			});
		},
		keydown:function(){
			Event.addListener(window,'keydown',function(event){
				var e =Event.getEvent(event);
				if(e.keyCode==13 && ( isSumbits || isSumbits == null )){
					handlerSumbit();
				}
			});
		},
		touch:function(){
			Event.addListener(sumbit,'touchstart',function(){
				if(isSumbits||isSumbits==null)
					handlerSumbit();
			});
		},
		change:function(){
			Event.addListener(form,'change',function(event){
				var event=Event.getEvent(event),
					target=Event.getTarget(event),
					name=target.name;
				if(formObjs[name]){
					if(name.indexOf('repeat')==0){
						formObjs[name].sameWarn();
					}
					formObjs[name].SayWarn();
					if(formObjs[name].ajax){
						formObjs[name].FormAjax();
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
	return function(infs,Callback,controls,formId,sumbitId,postURL,getURL,isSumbits){
		var len=infs.length;
		post_url=postURL;
		get_url=getURL;
		for(var i=0;i<len;i++){
			var inf=infs[i];
			formObj=new FormVerify({
				ID:inf.id,
				Type:inf.type,
				Pattern:inf.pattern,
				Ajax:inf.ajax
			},get_url);
			formObjs[inf.id]=formObj;
		}
		sumbit=doc.getElementById(sumbitId);
		isSumbits=isSumbits;
		form=doc.getElementById(formId);
		controlEvent(controls);
		callback=Callback;
        ajaxExpanding.init({
            name:'form',
            type:'post',
            async:'true',
            contentType:'form',
            charset:"utf-8",
            data:form
        });
	}
})();
