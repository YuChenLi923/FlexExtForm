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
						callback(10,this.Type);	
						this.flag=0;
						this.mask=0;		
					}
				}
				else{
					callback(11,this.Type);
					this.flag=0;	
				}
			},
			FormAjax:function(){
				var URL=this.URL,
					that=this;
					ajaxExpanding.init({
						type:'get',
						async:'true',
						contentType:'text',
						accept:"text",
						charset:"utf-8"
					});
				if(this.mask==1){
					ajaxExpanding.send({
						url:URL,
						data:{
							Value:this.value,
							Type:this.Id
						},
						onSuccess:function(responseText){
							var result=parseInt(responseText);
							if(result==0){
								callback(13,that.Type);
								this.flag=0;
							}
							else{
								callback(14,that.Type);
								this.flag=1;
							}
						},
						onFail:function(){
								callback(2,that.Type);
						}
					},this)
					this.mask=0;
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
			uploading(sumbit);
			AjaxSumbit('Form',URL,Form,callback);//表单异步提交的URL
			
	}
	// id-对应表单的id ,URL异步请求的URL，callback异步提交数据成功后的回调函数
	function AjaxSumbit(id,URL,Form,success,fail){
			var formObj=document.getElementById(id),
				flag=1;
			ajaxExpanding.init({
				type:'post',
				async:'true',
				contentType:'form',
				charset:"utf-8"
			});
			ajaxExpanding.send({
				url:URL,
				data:formObj,
				onSuccess:function(responseText){
					var flag=parseInt(responseText);	
						console.log(responseText);
						sumbit.innerHTML='提交数据';
						sumbit.setAttribute('switch','on');
						if (flag==1){
							callback(4,this.Type);
						}
						else{
							callback(3,this.Type);
						}
				},
				onError:function(){
					sumbit.setAttribute('switch','on');
					sumbit.innerHTML='提交';
					callback(2,this.Type);
				}
			},this)
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
