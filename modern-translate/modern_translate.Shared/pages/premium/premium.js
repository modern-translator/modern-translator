﻿!function(){"use strict";var i=WinJS.Navigation,n=(WinJS.Utilities,WinJS.Binding);WinJS.UI;WinJS.UI.Pages.define("/pages/premium/premium.html",{ready:function(t,e){var r=this,o=Windows.ApplicationModel.Store.CurrentApp;o.licenseInformation,Windows.ApplicationModel.Package.current.id.version;this.bindingData=WinJS.Binding.as({onclickBack:n.initializer(function(){i.back()}),isPremium:Custom.Utils.isPremium(),onclickBuy:n.initializer(function(){o.requestProductPurchaseAsync("premium").then(function(){r.bindingData.isPremium=Custom.Utils.isPremium()},function(i){})})}),n.processAll(t,this.bindingData),o.loadListingInformationAsync("premium").then(function(i){var n=i.productListings.premium.formattedPrice;t.querySelector(".price").innerText=n}).then(null,function(i){})}})}();