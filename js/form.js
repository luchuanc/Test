(function($){
	var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var regurl=new RegExp(strRegex);
	var regMapping = {
	    "positive": function(val) {
	        return /^[0-9]+([.]{1}[0-9]{1,10})?$/.test(val) || "请输入正数";
	    },
	    "positiveinteger": function(val) {
	        return /^[0-9]+([0-9]{1,10})?$/.test(val) || "请输入正整数";
	    },
	    "required": function(val) {
	        return /\S+/.test(val) || "请输入内容";
	    },
	    "discount": function(val) {
	        if (/^(\d+\.\d{1,1}|\d+)$/.test(val) && (val > 0 && val <= 10)) {
	            return true;
	        } else {
	            return "请输入0-10之间,只有1位小数的数字";
	        }
	    },
	    "url":function(url){
	    	return regurl.test(url) || "请输入正确的网址";
	    },
	    "character":function(val,params){
	    	var length=String(val).replace(/[^\x00-\xff]/g,'aa').length;
	    	var num = Math.ceil(length/2);
            if(num<params){
                
                return true;
            }else{
                return "请输入"+params+"个字符";
            }
	    },
	    "percent": function(val) {
	        if (/^(\d+\.\d{1,2}|\d+)$/.test(val) && (val >= 0 && val <= 100)) {
	            return true;
	        } else {
	            return "请输入0-100之间,只有2位小数的数字";
	        }
	    },
	    "percentone": function(val) {
	        if (/^(\d+\.\d{1}|\d+)$/.test(val)) {
	            return true;
	        } else {
	            return "请输入保留1位小数的数字";
	        }
	    },
	    "phone": function(val) {
	        if (val && (val.length == 4 && /^\d{4}$/i.test(val) || (val != 4 && /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(val) && val.length <= 11))) {
	            return true;
	        } else {
	            return "请输入手机号或者手机号后四位";
	        }
	    },

	    "boolean": function(val) {
	        if (val == 1 || val == 0) {
	            return true;
	        } else {
	            return "请输入0或1, 0:女,1:男";
	        }
	    },
	    "date": function(val) {
	        var date = new Date(val + " 12:00:00");
	        if (date) {
	            return true;
	        } else {
	            return "请输入有格的日期格式,如:1985-12-12";
	        }
	    },
	    "identify": function(val) {
	        if (customer.identify.test(val) || val == "") {
	            return true;
	        } else {
	            return "身份证号码输入有误";
	        }
	    },
	    "gt": function(val, params) {
	        return (/^[0-9]+([.]{1}[0-9]{1,10})?$/.test(val) && Number(val) > params[0]) || ("请输入大于" + params[0] + "的数");
	    },
	    "lt": function(val, params) {
	        return (/^[0-9]+([.]{1}[0-9]{1,10})?$/.test(val) && Number(val) < params[0]) || ("请输入小于" + params[0] + "的数");
	    }
	};
	//批量生产input对象
	function inputData(opt){
		$.extend(this,opt);
		this.init(this.$);
	}
	inputData.prototype={
		init:function($dom){
			this.getFormName($dom);
		},
		//获取对象名字 data-name
		getFormName:function($dom){
			var formArr=[];
			$dom.each(function(i,item){
				formArr.push({name:$(item).data("name"),checktype:$(item).data("checktype")});
			});
			this.formArr=formArr;
			this.createForm(formArr);
		},
		//批量创建对象
		createForm:function(formArr){
			var formList={},self=this;
			for(var i=0;i<formArr.length;i++){
				var item=formArr[i];
				formList[item.name]=new inputObj({
					$:self.$.eq(i),
					valueKey:item.name,
					checktype:item.checktype
				});
			}
			this.formList=formList;
		},
		//获取对象列表
		getList:function(){
			return this.formList;
		},
		//按名字获取对象
		getListByname:function(name){
			return this.formList[name];
		},
		//批量存数据
		setListValue:function(data){//data {"s3":"333","s4":"444"}
			var list=this.getList();
			for(var i in list){
				list[i].setValue(data);
			}
		},
		//批量取数据
		getListValue:function(){
			var list=this.getList(),res={};
			for(var i in list){
				$.extend(res,list[i].getValue(true));
			}
			return res;
		},
		//是否验证通过
		isPass:function(){
			var flag=true,list=this.getList(),flagobj,res;
			for(var i in list){
				if(!list[i].isPass){
					flag=false;
					flagobj=list[i];
				}
			}
			res={isPass:flag,errorObj:flagobj}
			return res;
		}
	}
	function inputObj(opt){
		$.extend(this,opt);
		this.isPass=true;
		this.error="请输入正确的值!";
		this.init();	
	}
	inputObj.prototype={
		init:function(){
			var self=this;
			self.checkValue(this.$.val(),this.checktype,false);
			this.$.change(function(){
				if(self.checktype){
					self.checkValue($(this).val(),self.checktype,true);	
				}else{
					self.isPass=true;//是否通过检测
				}
			});
		},
		//根据条件检查值是否通过
		checkValue:function(value,type,showTip){
			var self=this;
			var $this = this.$;
			var val = $.trim(value || "");
			if (!type) {
            	return true;
        	}
        	var regKeys = type.split(" ");
        	self.isPass=true;
        	$(regKeys).each(function(index, key) {
        	    var params = key.split(':');
        	    key = params[0];
        	    params.shift(0);
        	    var reg = regMapping[key];
        	    if (reg) {
        	        var ret = (key != "required" ? regMapping["required"](val) != true : false) || reg(val, params);
        	        if (ret != true) {
        	            self.isPass= false;
        	            self.error=ret;
        	            if (showTip)
        	                self.showerror(true);
        	            return false;
        	        }
        	    }
        	});
		},
		//创建value值 支持传对象或直接传值
		setValue:function(value){
			if(value && typeof value=="object"){
				this.$.val(value[this.valueKey]);
				this.checkValue(this.$.val(),this.checktype,false);	
			}else{
				this.$.val(value);
				this.checkValue(this.$.val(),this.checktype,false);	
			}
		},
		//获取value flag为true时 获取到的是对象
		getValue:function(flag){
			var res={};
			var self=this;
			if(flag){
				res[self.valueKey]=this.$.val();
				return res;
			}else{
				return this.$.val();
			}	
		},
		//显示错误 autohide 布尔类型 自动消失 text 自定义错误内容
		showerror:function(autohide,text){
			var self=this;
			var Text=text||this.error;
			$tip = $('<div class="cpnt-innertip">' +Text+ '</div>');
			this.$.focus().after($tip);
			if (autohide) {
	            var timer = this.$.data("timer");
	            if (timer) {
	                clearTimeout(timer);
	            }
	            this.$.data("timer", setTimeout(function() {
	                self.hideerror();
	            }, 2000));
	        }
		},
		hideerror:function(){
			this.$.siblings('.cpnt-innertip').remove();
		}
	}
	//批量生产select对象 data:{s3:[{name:"dddd",value:"111"},{name:"ssss",value:"222"}],s4:[{name:"qqqq",value:"333"},{name:"wwww",value:"444"}]},
	function selectData(opt){
		$.extend(this,opt);
		this.init(this.$);
	}
	selectData.prototype={
		init:function($dom){
			this.getFormName($dom);
		},
		//获取对象名字 data-name
		getFormName:function($dom){
			var formArr=[];
			$dom.each(function(i,item){
				formArr.push({name:$(item).data("name"),all:$(item).data("all")});
			});
			this.formArr=formArr;
			this.createForm(formArr);
		},
		//批量创建对象
		createForm:function(formArr){
			var formList={},self=this;
			for(var i=0;i<formArr.length;i++){
				var item=formArr[i];
				var callback=item.name+"callback";
				formList[item.name]=new selectObj({
					$:self.$.eq(i),
					valueKey:item.name,
					all:item.all,
					data:self.data[item.name],
					callback:self[callback]
				});
			}
			this.formList=formList;
		},
		//获取对象列表
		getList:function(){
			return this.formList;
		},
		//按名字获取对象
		getListByname:function(name){
			return this.formList[name];
		},
		//批量存数据
		setListValue:function(data){//data {"s3":"333","s4":"444"}
			var list=this.getList();
			for(var i in list){
				list[i].setValue(data);
			}
		},
		//批量取数据
		getListValue:function(){
			var list=this.getList(),res={};
			for(var i in list){
				$.extend(res,list[i].getValue(true));
			}
			return res;
		},
		//批量刷新
		refreshList:function(data){
			var list=this.getList();
			for(var i in list){
				list[i].refresh(data[i]);
			}
		}
	}
	function selectObj(opt){
		$.extend(this,opt);
		this.create();
	}
	selectObj.prototype={
		create:function(opt){
			var self=this;
			this.$.html("").append("<select></select>");
			var $box=this.$.find("select");
			if(this.all){
				$box.append("<option value='-1'>全部</option>");
			}
			if(this.data && this.data.length){
				for(var i=0;i<this.data.length;i++){
					var $dom=$('<option value='+this.data[i].value+'>'+this.data[i].name+'</option>');
					$box.append($dom);
				}
			}
			$box.change(function(){
				self.callback && self.callback(self.$.find("select").val());
			});
		},
		refresh:function(data){
			this.$.find("select").html("");
			if(data && data.length){
				for(var i=0;i<data.length;i++){
					var $dom=$('<option value='+data[i].value+'>'+data[i].name+'</option>');
					this.$.find("select").append($dom);
				}
			}
		},
		getValue:function(flag){
			var self=this;
			var res={};
			if(flag){
				res[self.valueKey]=this.$.find("select").val();
				return res;
			}else{
				return this.$.find("select").val();
			}
			
		},
		setValue:function(value){
			var $dom=this.$.find("select");
			if(value && typeof value=="object"){
				$dom.val(value[this.valueKey]);
			}else{
				$dom.val(value);
			}
		}
	}
	// var d=new selectData({
	// 	$:$(".selectObj"),
		
	// 	s3callback:function(v){
	// 		console.log(v);
	// 	},
	// 	s4callback:function(v){
	// 		console.log(v);
	// 	}
	// });

	//批量生产checkBox对象
	function checkboxData(opt){
		$.extend(this,opt);
		this.init(this.$);
	}
	checkboxData.prototype={
		init:function($dom){
			this.getFormName($dom);
		},
		//获取对象名字 data-name
		getFormName:function($dom){
			var formArr=[];
			$dom.each(function(i,item){
				formArr.push({name:$(item).data("name")});
			});
			this.formArr=formArr;
			this.createForm(formArr);
		},
		//批量创建对象
		createForm:function(formArr){
			var formList={},self=this;
			for(var i=0;i<formArr.length;i++){
				var item=formArr[i];
				var callback=item.name+"callback";
				formList[item.name]=new checkboxObj({
					$:self.$.eq(i),
					data:self.data[item.name],
					callback:self[callback]
				});
			}
			this.formList=formList;
		},
		//获取对象列表
		getList:function(){
			return this.formList;
		},
		//按名字获取对象
		getListByname:function(name){
			return this.formList[name];
		},
		//批量存数据
		setListValue:function(data){//data {"111":"1","222":"0"}
			var list=this.getList();
			for(var i in list){
				list[i].setValue(data);
			}
		},
		//批量取数据
		getListValue:function(){
			var list=this.getList(),res={};
			for(var i in list){
				$.extend(res,list[i].getValue(true));
			}
			return res;
		},
		//批量刷新
		refreshList:function(data){
			var list=this.getList();
			for(var i in list){
				list[i].refresh(data);
			}
		}
	}
	function checkboxObj(opt){
		$.extend(this,opt);
		this.create();
	}
	checkboxObj.prototype={
		create:function(opt){
			var self=this;
			this.$.html("");
			if(this.data && this.data.length){
				var data=this.data;
				for(var i=0;i<data.length;i++){
					var $dom=$('<label><input type="checkbox" data-name='+data[i].value+' value='+data[i].value+'>'+data[i].name+'</label>');
					self.$.append($dom);
				}
			}
			// self.$.change(function(){
			// 	self.callback && self.callback(self.$.find("select").val());
			// });
		},
		refresh:function(data){
			this.opt.$.html("");
			if(data && data.length){
				for(var i=0;i<data.length;i++){
					var $dom=$('<label><input type="checkbox" data-name='+data[i].value+' value='+data[i].value+'>'+data[i].name+'</label>');
					this.$.append($dom);
				}
			}
		},
		getValue:function(flag){
			var self=this,
				res={},
				ret=[],
				checkbox=this.$.find("input[type='checkbox']");
			if(flag){
				checkbox.each(function(index,value){
					if($(value).prop("checked")){
						res[$(value).data("name")]=1;
					}else{
						res[$(this).data("name")]=0;
					}
					
				});
				return res;
			}else{
				checkbox.each(function(index,value){
					ret.push($(this).val());
				});
				return ret;
			}
			
		},
		setValue:function(value){//{111:1,222:0}
			var $dom=this.$.find("input[type='checkbox']").prop("checked",false);
			if(value && typeof value=="object"){
				
				$.each($dom,function(j,item){
					for(var i in value){
						if(i==$(item).data("name")){
							if(value[i]){
								$(item).prop("checked",true);
							}
						}
					}
					
				});
			
			}else{
				$dom.val(value);
			}
		}
	}
	var g=new checkboxData({
		$:$(".cm_form_group"),
		data:{group1:[{name:"dddd",value:"111"},{name:"ssss",value:"222"}],group2:[{name:"qqqq",value:"333"},{name:"wwww",value:"444"}]},
		group1callback:function(v){
			console.log(v);
		},
		group2callback:function(v){
			console.log(v);
		}
	});
	$(".setValue").click(function(){
		g.setListValue({"111":0,"222":1,"333":1,"444":0});
	});
	$(".getValue").click(function(){
		$(".html").html(JSON.stringify(g.getListValue()));
	});

	window.formList={
		inputData:inputData,
		selectData:selectData,
		checkboxData:checkboxData
	}
})(jQuery);