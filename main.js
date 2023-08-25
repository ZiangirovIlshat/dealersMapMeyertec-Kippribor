document.addEventListener("DOMContentLoaded", function() {

    var app = new Vue({
        el: '.app',
        data: {
            selectedTab: 1,
    
            dealerData: dealerData,
    
            region:'',
            city:'',
            name:'',
    
            regions: [],
            cities:[],
            names:[],
        },
    
        created(){
            this.hintsForInput()

            const script  = document.createElement('script')
            script.id     = 'ymaps'
            script.src    = "***"
    
            document.head.append(script)
    
            script.onload = () => {
                ymaps.ready(() => (this.yamapsInit()))
            }
        },

        methods:{
            getActiveTab(number) {
                this.selectedTab = number
            },

            yamapsInit() {
                myMap = new ymaps.Map(
                    "map", {
                        center: [55.76, 37.64],
                        zoom: 5,
                        controls: [],
                    }, {
                        maxZoom: 10,
                        minZoom: 3,
                        suppressMapOpenBlock: true
                    }
                );
    
                var zoomControl = new ymaps.control.ZoomControl({
                    options: {
                        position: {
                            right: 10,
                            top: 108,
                        },
                    },
                });
    
                myMap.controls.add(zoomControl);
                myMap.behaviors.disable("scrollZoom");
    
                clusterer = new ymaps.Clusterer({
                    preset: "islands#invertedYellowClusterIcons",
    
                    groupByCoordinates: false,
    
                    clusterDisableClickZoom: true,
                    clusterHideIconOnBalloonOpen: false,
                    geoObjectHideIconOnBalloonOpen: false,
                })
    
                this.enterDataOnCard()
            },

            getPointData(index) {
                if (this.dealerData[index].phones) {
                    phones = '<p>Телефоны: </p>'
                    dealerData[index].phones.forEach((i) => {
                        phones += "<p><a href='tel:" +
                            i.link + "'>" + i.name + "</a>, </p>"
                    });
                }
        
                if (dealerData[index].site) {
                    site = '<p> Сайт: <a target="_blank" name="' + dealerData[index].name +
                        '" onclick="logData(this)" href="' + dealerData[index].site + '">' +
                        dealerData[index].site + "</p>"
                } else {
                    site = ''
                }
        
                return {
                    iconContent: dealerData[index].name,
                    balloonContentHeader: dealerData[index].name,
                    balloonContentBody: "<div class='dealer_info'>" + phones +
                        site +
                        "</a><p>Адрес: " +
                        dealerData[index].address + "</p> </div>",
    
                    clusterCaption: dealerData[index].name,
                };
            },

            getPointOptions() {
                return {
                    balloonPanelMaxMapArea: 0,
    
                    preset: "islands#yellowStretchyIcon",
    
                    openEmptyBalloon: true,
                    balloonMaxWidth: 300,
                };
            },

            enterDataOnCard() {
                points = [];
    
                for (var i = 0; i < this.dealerData.length; i++) {
                    points.push(this.dealerData[i].geo);
                }
            
                geoObjects = [];
        
                for (var i = 0, len = points.length; i < len; i++) {
                    geoObjects[i] = new ymaps.Placemark(
                        points[i],
                        this.getPointData(i),
                        this.getPointOptions()
                    );
                }
    
                clusterer.options.set({
                    gridSize: 180,
                    clusterDisableClickZoom: false,
                });
    
                clusterer.add(geoObjects);
                myMap.geoObjects.add(clusterer);
            },

            setZoom(value) {
                let mapData = {
                    ru: {
                        coord: [61.698657, 99.505405],
                        zoom: 2,
                    },
                    ru_cent: {
                        coord: [54.87375, 38.064727],
                        zoom: 6,
                    },
                    ru_nw: {
                        coord: [61.469754, 36.498137],
                        zoom: 6,
                    },
                    ru_south: {
                        coord: [48.622564, 43.16616],
                        zoom: 6,
                    },
                    ru_privol: {
                        coord: [55.485367, 51.524292],
                        zoom: 6,
                    },
                    ru_ural: {
                        coord: [60.519886, 64.350456],
                        zoom: 5,
                    },
                    ru_kavkaz: {
                        coord: [44.039802, 43.070643],
                        zoom: 6,
                    },
                    ru_sibir: {
                        coord: [55.030204, 82.92043],
                        zoom: 5,
                    },
                    ru_east: {
                        coord: [54.97761978841331, 125.82691195530121],
                        zoom: 5,
                    },
                    by: {
                        coord: [53.913926569457104, 27.546005025449215],
                        zoom: 7,
                    },
                    kz: {
                        coord: [48.136207, 67.153559],
                        zoom: 5,
                    },
                    kg: {
                        coord: [41.892648, 74.670581],
                        zoom: 7,
                    }
                }
                myMap.setCenter(mapData[value].coord, mapData[value].zoom, {
                    checkZoomRange: true,
                })
            },

            hintsForInput() {
                this.regions = []
                this.cities = []
                this.names = []

                for(let oneDealer of this.dealerData){
                    if(this.regions.indexOf(oneDealer.region) === -1 && this.sortFunc(oneDealer)){
                        this.regions.push(oneDealer.region)
                    }
                }
        
                for(let oneDealer of this.dealerData){
                    if(this.cities.indexOf(oneDealer.cities) === -1 && this.sortFunc(oneDealer)){
                        this.cities.push(oneDealer.city)
                    }
                }
        
                for(let oneDealer of this.dealerData){
                    if(this.names.indexOf(oneDealer.names) === -1 && this.sortFunc(oneDealer)){
                        this.names.push(oneDealer.name)
                    }
                }
            },

            sortFunc(item){
                let regionTrue = true
                let cityTrue = true
                let nameTrue = true

                if(Boolean(this.region)){
                    if(item.region.toLowerCase().indexOf(this.region.toLowerCase()) > -1){
                        regionTrue = true
                    }else{
                        regionTrue = false
                    }
                }
    
                if(Boolean(this.city)){
                    if(item.city.toLowerCase().indexOf(this.city.toLowerCase()) > -1){
                        cityTrue = true
                    }else{
                        cityTrue = false
                    }
                }
    
                if(Boolean(this.name)){
                    if(item.name.toLowerCase().indexOf(this.name.toLowerCase()) > -1){
                        nameTrue = true
                    }else{
                        nameTrue = false
                    }
                }
    
                if(regionTrue && cityTrue && nameTrue){
                    return true
                }
            },

            applyTel(item){
                return `tel:${item.phones[0].link}`
            },

            clear() {
                this.region = ''
                this.city = ''
                this.name = ''

                this.hintsForInput()
            }
        }
    })
});