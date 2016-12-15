(function(){

	function bind(element, type, callback) {
	    element.addEventListener(type, callback, false);
	}

	function moveImg(options){
		this.startIndex=options.startIndex || 0;
		this.numbs=options.numbs || 4;
		this.src=options.src || [];
		this.el = typeof options.el === "string" ? document.querySelector(options.el) : options.el;//装拼图的盒子
		this.imgbox=typeof options.imgbox === "string" ? document.querySelector(options.imgbox) : options.imgbox;//装图片的盒子
		this.max=options.max || 500;//默认最大500的宽度
		this.pass=options.pass || function(){};
	}
	moveImg.prototype={
		init:function(){
			this.loadImg();
		},
		creatCanvas:function(){
			var canvas=document.createElement("canvas");
			canvas.id="canvas";
			canvas.style.display="none";
			document.body.appendChild(canvas);
			this.canvas=canvas;
		},
		loadImg:function(){
			var _this=this;
			this.imgbox.innerHTML="";
			var img=document.createElement("img");
			img.src=this.src[this.startIndex];
			this.imgbox.appendChild(img);
			img.onload=function(){
				_this.cuttingImg(img);
			}
		},
		restart:function(){
			var img=this.img;
			var imgs=this.getimgmessage(img);
			this.render(this.imgList,imgs.nwidth,imgs.nheight,false);
		},
		next:function(){
			if(this.startIndex<this.src.length-1){
				this.startIndex++;
				this.loadImg();
			}
		},
		prev:function(){
			if(this.startIndex>0){
				this.startIndex--;
				this.loadImg();
			}
		},
		getimgmessage:function(img){
			var w,h,nwidth,nheight,
				numbs=this.numbs,tem=1;
			w=img.width>this.max?this.max:img.width;
			tem=img.width>this.max?this.max/img.width:1;
            h=img.height*tem;
            nwidth=w/numbs;
            nheight=h/numbs;
            return{nwidth:nwidth,nheight:nheight,w:w,h:h};
		},
		cuttingImg:function(img){
			this.creatCanvas();
			var numbs=this.numbs,
				canvas=this.canvas,
				arr=[],keys="";
            var $ul=this.el.querySelector("ul");
            var imgmessage=this.getimgmessage(img);
            $ul.innerHTML="";
            $ul.style.width=imgmessage.w+"px";
            $ul.style.height=imgmessage.h+"px";

            nwidth=imgmessage.nwidth;
            nheight=imgmessage.nheight;
            for(var i=0;i<numbs*numbs;i++){
            	var row=Math.floor(i/numbs);//行
            	var col=i%numbs;//列
            	canvas.width=nwidth;
            	canvas.height=nheight;
            	var ctx=canvas.getContext("2d");
            	ctx.drawImage(img,col*nwidth,row*nheight,nwidth,nheight,0,0,nwidth,nheight);
            	var image = canvas.toDataURL();
            	arr.push(image);
            }
            //移除canvas
            document.body.removeChild(this.canvas);

            this.imgList=arr;
            this.img=img;
            this.render(arr,nwidth,nheight,true);
		},
		creatLi:function(w,h,row,col,src){
			var li=document.createElement("li");
			li.style.width=w+"px";
			li.style.height=h+"px";
			li.style.left=col*w+"px";
			li.style.top=row*h+"px";
			li.style.position="absolute";
			li.style.border="1px solid #f3f3f3";

			li.positionList={x:col*w,y:row*h};//保存初始位置

			var img=document.createElement("img");
			img.src=src;
			li.appendChild(img);
			return li;
		},
		render:function(arr,nwidth,nheight,flag){
			var arr=[].concat(arr);
			var $ul=this.el.querySelector("ul");
			$ul.innerHTML="";

			var numbs=this.numbs;
			var keys=this.getlist(arr);
			for(var i=0;i<keys.length;i++){
				var row=Math.floor(i/numbs);//行
				var col=i%numbs;//列
				var $li=this.creatLi(nwidth,nheight,row,col,this.list[keys[i]]);
				$li.idx=keys[i];//打乱后的索引
				$li.index=i;//默认的索引
				$ul.appendChild($li);

				bind($li, "touchstart", this._start.bind(this));
				bind($li, "touchmove", this._move.bind(this));
				bind($li, "touchend", this._end.bind(this));	

			}
			this.lis=$ul.querySelectorAll("li");
			this.distanceX=this.getDistance(this.lis[0],this.lis[1]);//获取默认距离
			this.distanceY=this.getDistance(this.lis[0],this.lis[numbs]);//获取默认距离
		},
		getlist:function(arr){
			var res={},keys=[];
			for(var i=0;i<arr.length;i++){
				res[i]=arr[i];
				keys.push(i);
			}
			this.list=res;
			keys.sort(function(){
				return Math.random()-0.5;
			});
			return keys;
		},
		resetIndex:function(el){
			for(var i=0;i<this.lis.length;i++){
				if(this.lis[i]==el){
					el.style.zIndex=1;
				}else{
					this.lis[i].style.zIndex=0;
				}
			}

		},
		_start:function(evt){

			this._startX=evt.touches[0].pageX;
			this._startY=evt.touches[0].pageY;

			this.tochEvent=evt.target.parentElement;
			this.tochEvent.classList.remove("trans");

			this.resetIndex(this.tochEvent);

			this.tempX=this._startX-this.tochEvent.offsetLeft;//手指据当前图片的左距离
			this.tempY=this._startY-this.tochEvent.offsetTop;//手指据当前图片的顶距离

			console.log("evt%o",evt);
			console.dir(this.tochEvent);

			evt.preventDefault();
			

		},
		_move:function(evt){

			var _moveX=evt.touches[0].pageX;
			var _moveY=evt.touches[0].pageY;
			
			var x=_moveX-this.tempX;//手指距屏幕左边距的距离减去手指距当前图片的距离
			var y=_moveY-this.tempY;

			var border=(this.numbs-1)*2;//图片边距
			if(x<0){//超出拖动范围检测
				x=0;
			}else if(x>this.tochEvent.offsetWidth*(this.numbs-1)-border){
				x=this.tochEvent.offsetWidth*(this.numbs-1)-border;
			}
			if(y<0){//超出拖动范围检测
				y=0;
			}else if(y>this.tochEvent.offsetHeight*(this.numbs-1)-border){
				y=this.tochEvent.offsetHeight*(this.numbs-1)-border;
			}

			this.tochEvent.style.left=x+"px";
			this.tochEvent.style.top=y+"px";

			evt.preventDefault();
			

		},
		_end:function(evt){

			var oldEl=this.tochEvent;
			var distance=this.getshortdistance(this.tochEvent);
			var newEl=distance.dom;
			var oldImg=oldEl.querySelector("img");
			var newImg=newEl.querySelector("img");
			var numbs=this.numbs;
			//交换两个对象的src
			var temp=oldEl.idx;

			if(distance.r==this.distanceX || distance.r==this.distanceY) return;

			oldImg.src=this.list[newEl.idx];
			newImg.src=this.list[oldEl.idx];
			oldEl.idx=newEl.idx;
			newEl.idx=temp;
			//位置复原
			oldEl.classList.add("trans");
			oldEl.style.left=oldEl.positionList.x+"px";
			oldEl.style.top=oldEl.positionList.y+"px";

			//判断是否完成
			this.checkSuccess();

			evt.preventDefault();
		},
		getDistance:function(obj1,obj2){
			var a=(obj1.offsetLeft+obj1.offsetWidth/2)-(obj2.offsetLeft+obj2.offsetWidth/2);
			var b=(obj1.offsetTop+obj1.offsetHeight/2)-(obj2.offsetTop+obj2.offsetHeight/2);
			return Math.ceil(Math.sqrt(a * a + b * b));
		},
		getshortdistance:function(el){
			var list=this.lis,res=[];
			for(var i=0;i<list.length;i++){
				if(el!=list[i]){
					var r=this.getDistance(el,list[i]);
					var obj={dom:list[i],r:r};
					if(res.length==0){//没有值就插入
						res.push(obj);
					}
					if(r<res[0].r){//发现比第一个值还短的距离 就删除前一个值并插入当前值
						res.splice(0,1,obj);
					}
				}
			}
			return res[0];

		},
		checkSuccess:function(){
			var list=[].slice.call(this.lis);//将dom数组转化为数组
			var flag=list.every(function(item,index,array){
				return item.idx==item.index;
			});
			if(flag){
				this.pass && this.pass(this.startIndex);
			}
		}

	}
	window.moveImg=moveImg;
})();