$(function(){
	var input={
		init:function(){
			this.input=new formList.inputData({
				$:$(".inputObj")
			});
			this.$inputLog=$(".inputBox .log");
			this.inputButton={
				input_set:$(".inputBox .input_set"),
				input_get:$(".inputBox .input_get"),
				input_sub:$(".inputBox .input_sub")
			}
			this.inputObj={
				input_set:this.input_set,
				input_get:this.input_get,
				input_sub:this.input_sub
			}
			for(var i in this.inputButton){
				this.inputButton[i].on("click",this.inputObj[i]);
			}
		},
		input_set:function(){
			var _this=$(this);
			input.input.setListValue({"s1":"aaa","s2":"bbb","s3":"ccc","s4":"ddd"});
		},
		input_get:function(){
			var _this=$(this);
			input.$inputLog.html("当前结果为"+JSON.stringify(input.input.getListValue()));
		},
		input_sub:function(){
			var _this=$(this);
			var pass=input.input.isPass();
			if(!pass.isPass){
				pass.errorObj.showerror(true);
			}else{
				alert("验证通过,可以提交");
			}
		}
	}
	input.init();

	var select={
		init:function(){
			this.sel=new formList.selectData({
				$:$(".selectObj"),
				data:{s3:[{name:"dddd",value:"111"},{name:"ssss",value:"222"}],s4:[{name:"qqqq",value:"333"},{name:"wwww",value:"444"}]},
				s3callback:function(v){
					select.$inputLog.html("s3回调:"+v);
				},
				s4callback:function(v){
					select.$inputLog.html("s4回调:"+v);
				}
			});
			this.$inputLog=$(".selectBox .log");
			this.inputButton={
				select_set:$(".selectBox .select_set"),
				select_get:$(".selectBox .select_get")
			}
			this.inputObj={
				select_set:this.select_set,
				select_get:this.select_get
			}
			for(var i in this.inputButton){
				this.inputButton[i].on("click",this.inputObj[i]);
			}
		},
		select_set:function(){
			var _this=$(this);
			select.sel.refreshList({s3:[{name:"第一项",value:"a"},{name:"第二项",value:"b"}],s4:[{name:"右一",value:"c"},{name:"右二",value:"d"}]});
		},
		select_get:function(){
			var _this=$(this);
			select.$inputLog.html("当前结果为"+JSON.stringify(select.sel.getListValue()));
		}
	}
	select.init();

});