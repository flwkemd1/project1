sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageBox",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (Controller, JSONModel, MessageBox, Filter, FilterOperator) {
		"use strict";
	
		return Controller.extend("zproject1.controller.App", {
				onInit: function () {
					var oModel = new JSONModel({
						create : {
							mandt : '100',
							carrid : '',
							connid : '',
							fldate : ''							
						}
						,filter : {
							carrid : '',
							connid : '',
							fldate : ''
						},
						it_data  : [],
						it_data2 : [],
						editMode : false
					});

					this.getView().setModel(oModel, "main");
				
			},

			// 생성
			onCreate : function(oEvent){
				var oData = {};
				var that = this;
				var oModel = this.getView().getModel("main");
				var oCreate = oModel.getProperty('/create');
				
				oData.mandt = String(100); 
				oData.carrid = String(oCreate.carrid);
				oData.connid = String(oCreate.connid);
				oData.fldate = String(oCreate.fldate);
				
				var oModelS = this.getOwnerComponent().getModel();
				oModelS.create('/ZFLIGHTSet', oData, {
					success : function(oEvent){
						
						var empty = {
								mandt : '100',
								carrid : '',
								connid : '',
								fldate : ''							
							}
						oModel.setProperty('/create', empty);

						that.onSearch();

						MessageBox.show('생성 성공');
					},
					error : function(oEvent){
						MessageBox.show('생성 실패');
					}
				})

			},

			// 조회
			onSearch: function(oEvent){
				var oModel = this.getView().getModel("main");
				var oEdit = oModel.setProperty('/editMode', false);
						
				var oFilter = oModel.getProperty('/filter');

				var mFilter = [];
				for(var sKey in oFilter){
					var oVal = oFilter[sKey];
					if(oVal) {
						mFilter.push(new Filter({
							path: sKey,
							operator: FilterOperator.Contains,
							value1: oVal,
						}));
					}
				}

				var oModelS = this.getOwnerComponent().getModel();
				oModelS.read('/ZFLIGHTSet', {
					filters : mFilter,
					success : function(oEvent){
						var aData = []; 
						if(oEvent.results.length > 0){
							aData = JSON.parse(oEvent.results[0].it_data);
							oModel.setProperty('/it_data', aData);
						}
					},
					error : function(oEvent){
						MessageBox.show('조회 실패');
					}
				})
			},

			// 편집 가능 유무
			onEdit : function(oEvent){
				var oModel = this.getView().getModel("main");
				var oEdit = oModel.getProperty('/editMode');

				if(oEdit == false){
					oModel.setProperty('/editMode', true);
				}else{
					oModel.setProperty('/editMode', false);
				}
			},

			// 화면에 보이는 테이블 DB 업데이트 및 저장(MODIFY)
			onSave : function(oEvent){
				var that = this;
				var oModel = this.getView().getModel("main");
				var aIt_data = oModel.getProperty("/it_data");

				var oData = {};
				oData.mandt = String(100); 
				oData.carrid = String('AA');
				oData.connid = String('11');
				oData.fldate = String('2020-01-01');
				oData.it_data = JSON.stringify(aIt_data);


				var oModelS = this.getOwnerComponent().getModel();

				var sKey = oModelS.createKey('/ZFLIGHTSet', oData);
				oModelS.update(sKey, oData, {
					success : function(result){
						MessageBox.show('저장 성공');
						that.onSearch();
					},
					error : function(result){
						MessageBox.show('저장 실패');
					}					
				})

			},

			// 테이블 라인 추가
			onAdd : function(oEvent){

				var oModel = this.getView().getModel("main");
				var oData = oModel.getProperty('/it_data');

				var oAdd = new JSONModel({
					it_add : {
						mandt : '',
						carrid : '',
						connid : '',
						fldate : '',
						price : ''
					}
				});

				oData.unshift(oModel.getProperty('/it_add'));
				oModel.refresh();
				

			},
			
			// 테이블 라인 삭제 (DB 삭제 X)
			onDelete : function(oEvent){
				var oModel = this.getView().getModel("main");
				var oData = oModel.getProperty('/it_data');

				var oTable = this.getView().byId('table');
				var select = oTable.getSelectedIndices();

				for(var i=0; i<select.length; i++){
					var index = select[select.length-i-1];
					if(index > -1){
						oData.splice(index, 1);
					}
				}

				oTable.clearSelection();
				oModel.refresh();
			},

			// 선택한 Line DB 삭제
			onSelectedDelete : function(){

				var that = this;

				var oModel = this.getView().getModel("main");
				var oIt_data = oModel.getProperty('/it_data');
				var oTable = this.getView().byId('table');

				var select = oTable.getSelectedIndices();

				var oData = {};
				var oSelected = [];

				for(var i=0; i<select.length; i++){
					oSelected.push(oIt_data[select[i]]);
				}

				oData.mandt = String(100); 
				oData.carrid = String('AB');
				oData.connid = String('11');
				oData.fldate = String('2020-01-01');
				oData.it_data = JSON.stringify(oSelected);

				var oModelS = this.getOwnerComponent().getModel();
				var sKey = oModelS.createKey('/ZFLIGHTSet', oData);

				oModelS.remove(sKey, {
					success: function(event) {
						MessageBox.show('삭제 성공.');
						that.onSearch();
					},
					error: function(event) {
						MessageBox.show('삭제 실패.');
					}
				});

				   oTable.clearSelection();

			}

		});
	});	
