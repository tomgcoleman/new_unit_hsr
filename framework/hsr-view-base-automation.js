define('hsrMva', [
    'QUnit', 'uitk'
], function(QUnit, uitk) {
    'use strict';

    function HSRAuto() {
        QUnit.module("Acceptance: HSR");

        //JS Object Tests
        QUnit.test("Javascript object existence tests", function () {
            QUnit.ok(window.pageModel, 'Object: pageModel should exists');
        });
        QUnit.test("Scan Page", function () {
            QUnit.ok(window.HsrMva.ScanAllPages(), 'HsrScrapePageElements() executed');
        });
    }

    var ScrapeID = null;
    var PathName = null;
    var HostName = null;
    var ResultAllTagsSent = false;
    var TestDataUrl = "https://chellsbanl01/"; //"https://localhost:8443/"; //

    function HsrSetDataServer(serverName) {
        if (serverName.length > 0) {
            TestDataUrl = "https://" + serverName + "/";
            window.console.log("*** HsrMva - HsrSetDataServer - TestDataUrl: " + TestDataUrl);
        }
    }

    function HsrScrapeGenericElement(objName, GenericObj) {
        window.console.log("***Scraping data for Pane: " + objName);
        var DataStr = JSON.stringify(GenericObj);
        var TagsStr = HsrScanObjSetTags(GenericObj, "");
        var AllTagsStr = HsrScanObjAllTags(GenericObj, "");
        HsrPostElement(objName, TagsStr, DataStr);
        HsrPostCompleteTagInfo(objName, AllTagsStr);
    }

    function HsrInjectGenericElement(pageObjs, objectName, ObjData) {
        if (ObjData) {
            window.console.log("*** HsrInjectPageElement data for Pane: " + objectName);
            pageObjs[objectName] = ObjData;
        }
        else {
            pageObjs[objectName] = null;
            window.console.log('ERROR - No Data')
        }
    }

    function HsrScrapeResultsElement(ResultsObjs) {
        var Count = 0;
        ResultsObjs.forEach(function (dat) {
            window.console.log("***Scraping data for Results #: " + Count++);
            var DataStr = JSON.stringify(dat);
            if (!ResultAllTagsSent) {
                ResultAllTagsSent = true;
                var AllTagsStr = HsrScanObjAllTags(dat, "");
                if (AllTagsStr) {
                    AllTagsStr += ","
                }
                AllTagsStr += HsrScanObjAllTags(dat.retailHotelPricingModel, "PricingModel_");
                HsrPostCompleteTagInfo('results', AllTagsStr);
            }
            var TagsStr = HsrScanObjSetTags(dat, "");
            if (TagsStr) {
                TagsStr += ","
            }
            TagsStr += HsrScanObjSetTags(dat.retailHotelPricingModel, "PricingModel_");

            HsrPostElement("results", TagsStr, DataStr);

        });
    }

    function HsrInjectResultsElement(pageObjs, objectName, ObjData) {
        if (ObjData) {
            window.console.log("*** HsrInjectPageElement data for Pane: " + objectName);
            pageObjs.results.push(ObjData);
            pageObjs.searchResults.hotelCount++;
        }
        else {
            window.console.log('ERROR - No Data')
        }
    }

    /**
     * @return {string}
     */
    function GetPathName() {
        var PathNameLocal = window.location.pathname.replace('/', '');
        var loc = PathNameLocal.lastIndexOf('.');
        if (loc > 0) {
            loc++;
            PathNameLocal = PathNameLocal.substr(loc)
        }
        return PathNameLocal;
    }

    /**
     * @return {boolean}
     */
    function HsrScrapePageElements() {

        PathName = GetPathName();
        HostName = window.location.hostname;

        HsrGetScrapeId();
        window.console.log("***Scrapping data --- Start --- ScrapeID: " + ScrapeID + " HostName: " + HostName + " PagePath: " + PathName);
        var pageObjs = window.pageModel;
        if (PathName == "Hotel-Search") {
            for (var objName in pageObjs) {
                switch (objName) {
                    case 'results':
                        HsrScrapeResultsElement(pageObjs[objName]);
                        break;
                    default:
                        HsrScrapeGenericElement(objName, pageObjs[objName]);
                        break;
                }

            }
            HsrSetScrapeDone(true);
            window.console.log("***Scrapping DONE --- Start --- ScrapeID: " + ScrapeID + " HostName: " + HostName + " PagePath: " + PathName);
        }
        return true;
    }

    function HsrInjectPageElements() {
        var VarObjName = null;
        PathName = GetPathName();
        HostName = window.location.hostname;

        if (PathName == "Hotel-Search") {
            VarObjName = "results"
        }
        else { //if(PagePath != "Hotel-Search"){
            VarObjName = "NONE"
        }

        window.console.log("*** HsrInjectPageElement data --- Start --- HostName: " + HostName +
            " PagePath: " + PathName);

        var pageObjs = window.pageModel;
        var ListNames = HsrGetFullElementList(VarObjName);

        var HasAddedResult = false;
        var tt = JSON.parse(ListNames);

        tt.forEach(function (dat) {
            var objectName = dat['Name'];
            var ObjData = dat['Data'][0];
            window.console.log("*** ### $$$ objectName:" + objectName); //+ " ObjData:" + ObjData);
            if (objectName.indexOf("results") != -1) {
                if (!HasAddedResult) {
                    HasAddedResult = true;
                    window.pageModel.results = [];
                    window.pageModel.searchResults.hotelCount = 0;
                }
                HsrInjectResultsElement(pageObjs, objectName, ObjData);
            }
            else {
                HsrInjectGenericElement(pageObjs, objectName, ObjData);
            }
        });
        window.pageModel.pagination.pageIndex = 0;
        window.pageModel.pagination.isLastPage = true;
        window.pageModel.pagination.pageCount = 1;
        window.pageModel.pagination.pageNumber = 1;
        window.pageModel.pagination.pageUpperCount = 50;
        window.pageModel.pagination.totalCount = window.pageModel.results.length;

        HsrRenderPage();
        window.console.log("*** HsrInjectPageElement data --- Done --- HostName: " + HostName + " PagePath: " + PathName);
    }

    /**
     * @return {string}
     */
    function HsrScanObjSetTags(pageObj, ObjLabel) {
        var TagsStr = "";
        if(pageObj) {
            for (var objName in pageObj) {
                if ((typeof (pageObj[objName]) == "boolean") && (pageObj[objName])) {
                    //console.log("###   " + typeof (pageObj[objName]) + "   " + objName);
                    if (TagsStr) {
                        TagsStr += ","
                    }
                    TagsStr += ObjLabel + objName;
                }
            }
        }
        return TagsStr;
    }

    /**
     * @return {string}
     */
    function HsrScanObjAllTags(pageObj, ObjLabel) {
        var TagsStr = "";
        if(pageObj) {
            for (var objName in pageObj) {
                if ((typeof (pageObj[objName]) == "boolean")) {
                    //console.log("###   " + typeof (pageObj[objName]) + "   " + objName);
                    if (TagsStr) {
                        TagsStr += ","
                    }
                    TagsStr += ObjLabel + objName;
                }
            }
        }
        return TagsStr;
    }


    function HsrPostElement(objName, TagsStr, DataStr) {
        var URLParams = "HostName=" + HostName;
        URLParams += "&PathName=" + PathName;
        URLParams += "&SessionID=" + ScrapeID;
        URLParams += "&ObjectName=" + objName;
        URLParams += "&Task=PushData";
        URLParams += "&Tags=" + TagsStr;
        HsrPostTxtData("DataStoreDB.jsp", URLParams, DataStr);
    }

    function HsrPostCompleteTagInfo(objName, TagsStr) {
        var URLParams = "HostName=" + HostName;
        URLParams += "&PathName=" + PathName;
        URLParams += "&ObjectName=" + objName;
        URLParams += "&Task=FullTagList";
        URLParams += "&Tags=" + TagsStr;
        HsrPostTxtData("DataStoreDB.jsp", URLParams, "***")
    }

    function HsrPostTxtData(JspPage, URLParams, Payload) {
        var xmlHttp = new XMLHttpRequest();
        var mUrl = TestDataUrl;
        mUrl += JspPage;
        if (URLParams) {
            mUrl += '?' + URLParams;
        }
        console.log('Post URL: ' + mUrl);
        xmlHttp.open("Post", mUrl, false);
        xmlHttp.setRequestHeader("Content-type", "Text/Plain", "charset=UTF-8");
        xmlHttp.send(Payload);
    }

    /**
     * @return {string}
     * @return {string}
     */
    function HsrGetTxtData(JspPage, URLParams) {

        var xmlHttp = new XMLHttpRequest();
        var mUrl = TestDataUrl;
        mUrl += JspPage;

        if (URLParams) {
            mUrl += '?' + URLParams;
        }
        window.console.log('Get URL: ' + mUrl);
        xmlHttp.open("GET", mUrl, false);
        xmlHttp.setRequestHeader("Content-type", "Text/Plain", "charset=UTF-8");
        xmlHttp.send();
        var responseTxt = '';
        if (xmlHttp.status == 200) {
            responseTxt = xmlHttp.responseText;
        }
        else {
            window.console.log('ERROR URL: ' + mUrl);
            window.console.log('ERROR xmlHttp.status :' + xmlHttp.status);
            window.console.log('ERROR responseText: is empty  ');
        }
        //console.log('responseText: ' +  responseTxt);
        return responseTxt;
    }

    function HsrRenderPage() {
        window.pageModel.error.errorMessage = "";
        window.pageModel.error.isErrorMessage = false;
        window.pageModel.error.eventCode = "";

        //window.pageModel.banners = []
        window.console.log('inject json debug *** HsrRenderPage ');
        require('presenter', function (required_module) {
            window.presenter = required_module;
            required_module['render'](window.pageModel);
        });
        window.console.log('inject json debug *** DONE - HsrRenderPage - presenter');
        require('modelPopulator', function (required_module) {
            window.modelPopulator = required_module;
            required_module['populate'](window.pageModel);
        });
        window.console.log('inject json debug *** DONE - HsrRenderPage - modelPopulator');
    }

    /**
     * @return {string}
     */
    function HsrGetFullElementList(VarObjName) {
        var URLParams = "HostName=" + HostName;
        URLParams += "&PathName=" + PathName;
        URLParams += "&VarObject=" + VarObjName;
        URLParams += "&Task=GetFullElementSet";
        return HsrGetTxtData("DataStoreDB.jsp", URLParams);
    }

    function HsrGetScrapeId() {
        var URLParams = "HostName=" + HostName;
        URLParams += "&PathName=" + PathName;
        URLParams += "&Task=GetScrapeID";
        ScrapeID = HsrGetTxtData("DataStoreDB.jsp", URLParams);
        return ScrapeID;
    }

    function HsrSetScrapeDone(Completed) {
        if (ScrapeID) {
            var URLParams = "SessionID=" + ScrapeID;
            URLParams += "&Completed=" + Completed;
            URLParams += "&Task=ScrapeDone";
            ScrapeID = HsrPostTxtData("DataStoreDB.jsp", URLParams);
            return ScrapeID;
        }
    }

    function TriggerNextPage1() {
        document.getElementsByClassName('pagination-next')[0].click();
        window.console.log("*** HsrScanAllPages - click");
        var page_load_topic = 'afterPageRender';
        window.page_loaded_token = uitk.subscribe(page_load_topic, function () {
            window.console.log('ScanAllPages event received: ' + page_load_topic);
            uitk.unsubscribe(page_load_topic, window.page_loaded_token);
            window.HsrMva.ScanAllPages();
            window.console.log('ScanAllPages event received DONE: ' + page_load_topic);
        });
    }

    var HsrDoneScaningPages = false;

    return {
        /**
         * @return {boolean}
         */
        IsScrapeRequest: function () {
            return QUnit.config.isSet('HSRMva', 'Scrape');
        },

        /**
         * @return {boolean}
         */
        IsInjectRequest: function () {
            return QUnit.config.isSet('HSRMva', 'Inject');
        },

        ScrapePageElements: function () {
            if (QUnit.config.ValueCount('HSRMva') > 1) {
                var server = QUnit.config.ValueAt('HSRMva', 1);
                HsrSetDataServer(server);
            }
            window.console.log("*** HsrMva - ScrapePageElements - TestDataUrl: " + TestDataUrl);
            HsrScrapePageElements();
        },

        InjectPageElement: function () {
            if (QUnit.config.ValueCount('HSRMva') > 1) {
                var server = QUnit.config.ValueAt('HSRMva', 1);
                HsrSetDataServer(server);
            }
            window.console.log("*** HsrMva - InjectPageElement - TestDataUrl: " + TestDataUrl);
            HsrInjectPageElements();
        },

        /**
         * @return {boolean}
         */
        ScanAllPages: function () {
            window.console.log("*** HsrScanAllPages ");

            window.HsrMva.ScrapePageElements();
            var nextBtn = document.getElementsByClassName('pagination-next')[0];

            if (nextBtn.disabled == false) {
                window.setTimeout(TriggerNextPage1, 5000);
            }
            else {
                window.console.log("*** HsrScanAllPages Done");
                HsrDoneScaningPages = true;
            }
            return HsrDoneScaningPages;
        },

        DoneScaningPages: function () {
            return HsrDoneScaningPages;
        },

        SetDataServer: function (serverName) {
            HsrSetDataServer(serverName);
        },
        HSRAuto: HSRAuto
        ///**
        // * @return {boolean}
        // */
        //IsPageRenderDone : function(){
        //    return  HsrIsPageRenderDone();
        //}
    };
});
