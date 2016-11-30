var createForm=(function createForm(){
	var Form={},
		id=null,
		doc=document,
		callback=null,
		sumbit,
		forms,
		URL;
	function  FormVerify(formInf,URL){
			this.Id=formInf.ID;
			this.Type=formInf.Type;
			this.pattern=formInf.Pattern;
			this.input=doc.getElementById(formInf.ID);
			this.value=this.input.value;
			this.mask=1;
			this.flag=1;
			this.URL=URL;
			this.ajax=formInf.ajax;
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
				if(this.Id == 'repeatKey'){
					 var key=doc.getElementById('Key');
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
				alert('请核对信息!');
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
	function CreateData(id){
			var form=doc.getElementById(id);
			var data=null;
			data=new FormData(form);//IE10+,Opera 12+,Safari 5+,Chorme 7+
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
				ErrorPrompt:inf.errorPrompt,
				SpacePrompt:inf.spacePrompt
			},URL);
			Form[inf.id]=form;
		}
		sumbit=getElement(doc,'#'+id+'_sumbit',true)
		forms=getElement(doc,'#'+id,true)
		id=id;
		controlEvent(controls);
		callback=Callback;
	};
})();
