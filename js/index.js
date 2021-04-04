var btn =document.getElementsByTagName('button');
var num =document.getElementById('num');
var mine =document.getElementById('mine');
mine.oncontextmenu =function() {
	return false;
}
function clickBtn() {
	for(let i=0;i<btn.length;i++) {
	btn[i].onclick =function() {
		for(let n=0;n<btn.length;n++) {
			btn[n].className ="";
			
		}
		btn[i].className ="active";
		if(i ==0) {
			var mine1 =new Mine(8,8,10);
			mine1.init();
		} else if(i ==1) {
			var mine2 =new Mine(14,14,30);
			mine2.init();
		} else if(i ==2){
			var mine3 =new Mine(20,20,45);
			mine3.init();
		} else {
			console.log('重新开始');
		}
	}
}
}



//自定义行列
function Mine(tr,td,mineNum) {
	this.tr =tr;
	this.td =td;
	this.mineNum =mineNum;  //雷的数量
	this.squares=[];  //所有格子信息
	this.tds =[]  //所有格子
	this.surplusMine =mineNum;    //剩余雷数
	this.allright =false;     //判断是否标雷正确
	
	this.box =document.getElementById("gameBox");
}



Mine.prototype.createDom =function() {
	var that =this;   //函数中this指向不再是Main实例
	var tab =document.createElement('table');
	this.box.innerHTML ="";
	for(let i=0;i<this.tr;i++) {
		var tabTr =document.createElement('tr');
		this.tds[i] =[];
		
		for(var j=0;j<this.td;j++) {
			var tabTd =document.createElement("td");
			
			tabTd.pos =[i,j]      //方便取值
			tabTd.onmousedown =function() {
				that.play(event,this);
			}
			
			
			this.tds[i][j] =tabTd;
			
			//不显示
			// if( this.squares[i][j].type =="lei")  {   //如果是雷
			// 	tabTd.className ="lei";
			// } else if( this.squares[i][j].type =="number") {
			// 	tabTd.innerHTML =this.squares[i][j].value;
			// }
			tabTr.appendChild(tabTd);     //不断给单行加单元格
		}
		tab.appendChild(tabTr);    //给表格不断加行
	}
	this.box.appendChild(tab);
}



Mine.prototype.random =function() {           //生成不重复的所有数字
	var square =new Array(this.tr*this.td);     //创建一个长度为总格子数的数组
	for(let i=0;i<square.length;i++) {
		square[i] =i;
	}
	square.sort(function() {
		return 0.5-Math.random()
	});
	return square.slice(0,this.mineNum);
}


//计算每个格子周围的雷，来呈现相应的数字
Mine.prototype.getAround =function(square) {
	var x =square.x;
	var y =square.y;
	var result =[];      //找到雷的数量；数组的长度为雷数量
	
/**
	*   x-1,y-1			x,y-1			x+1,y-1
	* 	x-1,y				x,y				x+1,y
	* 	x-1,y+1			x,y+1			x+1,y+1
	*/
 for(var i=x-1;i<=x+1;i++){
	 for(var j=y-1;j<=y+1;j++) {
		 //排除多种情况
		 if( 
			i<0 ||
			 j<0 || 
			 i>this.td-1 ||
				j>this.tr-1 ||
				(i==x && j==y) ||
				this.squares[j][i].type =="lei" ) {
			 continue;
		 }
		 result.push([j,i]);
	 }
 }
 return result;
}


Mine.prototype.upDate =function() {
	for(var i=0;i<this.tr;i++){
		 for(var j=0;j<this.td;j++) {
				//只更新雷周围的数字
				if( this.squares[i][j].type =='number') {
					continue;
				}
				var num =this.getAround(this.squares[i][j]);  //得到雷周围的数字;以位置坐标为元素的数组
				
				for(let k=0;k<num.length;k++)  {  //计算格子有多少个雷
					this.squares[num[k][0]][num[k][1]].value +=1;
				}
			}
	}
}


Mine.prototype.play =function(e,obj) {
	var that =this;
	if(e.which==1) {
		//点击左键
		var curSquare =this.squares[obj.pos[0]][obj.pos[1]];
		if(curSquare.type =="number") {
			//点到的是数字
			
			if(curSquare.value ==0) {
				//使用递归来实现    显示自己；四周寻找，不为0就显示自己；为0就显示自己 并且继续寻找四周
				function getAllZero(square) {
					var around =that.getAround(square);
					for(var i=0;i<around.length;i++) {
						//around[i] ==0,0
						var x =around[i][0];
						var y =around[i][1];
						
						//变空白
						// that.tds[x][y].className ="zero";
						if(that.squares[x][y].value ==1) {
							that.tds[x][y].className ="one";
						} else if(that.squares[x][y].value ==2){
							that.tds[x][y].className ="two";
						} else if (that.squares[x][y].value ==3) {
							that.tds[x][y].className ="three";
						} else if(that.squares[x][y].value ==4) {
							that.tds[x][y].className ="four";
						} else if (that.squares[x][y].value ==5) {
							that.tds[x][y].className ="one";
						} else if (that.squares[x][y].value ==0) {
							that.tds[x][y].className ="zero";
						}
						
						
						if(that.squares[x][y].value ==0) {
							//自定义一个属性
							if(!that.tds[x][y].check) {
								that.tds[x][y].check =true;
								getAllZero(that.squares[x][y]);
							}
						} else {
							//如果周围的那个不为0
							that.tds[x][y].innerHTML =that.squares[x][y].value;
							
						}
					}
				}
				getAllZero(curSquare);
				return;
			}
			obj.innerHTML =curSquare.value;
			// obj.className =cl[curSquare.value];
			if(curSquare.value ==1) {
				obj.className ="one";
			} else if(curSquare.value ==2){
				obj.className ="two";
			} else if (curSquare.value ==3) {
				obj.className ="three";
			} else if(curSquare.value ==4) {
				obj.className ="four";
			} else if (curSquare.value ==5) {
				obj.className ="one";
			}
		} else {
			//点到的是雷
			// obj.className ="lei";
			//obj
			// console.log("liangle");
			that.gameover();
			
		}
	}
	if(e.which ==3) {
		//点击右键
		//已经点过的格子变成了数字，不能点击
		if(obj.className && obj.className!="flag") {
			return;
		}
		//不懂
		obj.className= obj.className=='flag'?'':'flag';
		if(this.squares[obj.pos[0]][obj.pos[1]].type =="lei") {
			this.allright =true;
			// obj.className ="flag";
		} else {
			this.allright =false;
			// obj.className ="flag"
		}
		if(obj.className =="flag") {
			num.innerHTML =--this.surplusMine;
		} else {
			num.innerHTML =++this.surplusMine;
		}
		if(this.surplusMine ==0) {
			
			if(this.allright ==true) {
				alert('游戏成功');
			} else {
				this.gameover();
			}
		}
	}
}


//
Mine.prototype.gameover =function() {
	// var that =this;
	//显示所有的雷  ；取消所有点击事件
	
	for(var i=0;i<this.tr;i++) {
		for(var j=0;j<this.td;j++) {
			if(this.squares[i][j].type =="lei") {
				this.tds[i][j].className ="lei";
			}
			this.tds[i][j].onmousedown =null;
		}
	}
	alert('游戏结束');
}
Mine.prototype.init =function() {
	
	var vn =this.random();
	var n =0;
	for(var i=0;i<this.tr;i++){
		this.squares[i] =[];
		for(var j=0;j<this.td;j++) {
			n++;
			if(vn.indexOf(n) !=-1) {
				this.squares[i][j] ={type:"lei",x:j,y:i}
			} else {
				this.squares[i][j] ={type:"number",x:j,y:i,value:0}
			}
			
			//通过行和列来找格子位置；行--列
		}
	}
	this.upDate();
	this.createDom();
	num.innerHTML =this.surplusMine;
}

var mine =new Mine(8,8,10);
mine.init();
clickBtn();