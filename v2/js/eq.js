// 地震列表 table id="gvEvent"
// 滑鼠移上表格或是地圖上的地震標記時

(function () {
    var pupupSource, pupupTemplate;

    return {

        eqhover: function () {
            //
            // 地圖上-----------------------------------------------------
            //

            $('.marker').hover(function () { // 滑鼠移入

                var j = $(this).attr('idx');
                var num = $(this).attr('type'),
                    num = j === 1 ? num + '[new]' : num;

                var p_left = $(this).css('left');
                p_left = p_left.substring(0, p_left.length - 2);
                p_left = p_left * 1 + 25.0;

                var p_top = $(this).css('top');
                p_top = p_top.substring(0, p_top.length - 2);
                p_top = p_top * 1 + 25.0;

                var $eqInfo = $('#gvEvent tr:eq(' + j + ')').children('td'),
                    c_time = $eqInfo.eq(1).text(), //取Table的時間
                    c_mag = $eqInfo.eq(4).text(), //取Table的規模
                    c_dep = $eqInfo.eq(5).text(), //取Table的深度
                    c_loc = $eqInfo.eq(6).text(); //取Table的位置

                var context = {
                    num: num,
                    p_left: p_left,
                    p_top: p_top,
                    c_time: c_time, //取Table的時間
                    c_mag: c_mag, //取Table的規模
                    c_dep: c_dep, //取Table的深度
                    c_loc: c_loc, //取Table的位置
                }
                // 跳出視窗內容--------------------------------------------------------------------
                var str = pupupTemplate(context);

                // CSS套用與移除--------------------------------------------------------------------
                $('#gvEvent tr:eq(' + j + ')').addClass('eqhover_gv');

                if (num == '小區域') {
                    $(this).addClass('marker_local_over');
                } else {
                    $(this).addClass('marker_number_over');
                }

                $(this).after(str);

            }, function () { // 滑鼠移出
                var j = $(this).attr('idx');
                $(this).removeClass('marker_number_over marker_local_over');
                $('#gvEvent tr:eq(' + j + ')').removeClass('eqhover_gv');
                $('.popup').remove();
            });

            //
            // 表格上-----------------------------------------------------
            //
            $('#gvEvent tr:gt(0)').hover(

                function () { // 滑鼠移入

                    var j = $(this).index();
                    var eqnum = $(this).children('td').eq(0).text();
                    var eqlat = $(this).children('td').eq(2).text();  // 緯度
                    var eqlon = $(this).children('td').eq(3).text();  // 經度

                    $(this).addClass('eqhover_gv');

                    if (eqlat > 21 && eqlat < 26 && eqlon > 119 && eqlon < 123) { //通常遠地地震會在範圍外

                        if (eqnum == '小區域') {
                            $('.marker[idx=' + j + ']').addClass('marker_local_over');
                        }
                        else {
                            $('.marker[idx=' + j + ']').addClass('marker_number_over'); //包含編號地震與遠地地震
                        }
                    } else {
                        $('#mainmap').prepend('<div class="eqoutside">　震央超出顯示範圍　</div>');
                    }

                }, function () { // 滑鼠移出

                    var j = $(this).index();

                    $(this).removeClass('eqhover_gv');
                    $('.marker[idx=' + j + ']').removeClass('marker_number_over marker_local_over');
                    $('.eqoutside').remove();

                });

        },
        init: function () {

            pupupSource = document.getElementById("popup-template").innerHTML;
            pupupTemplate = Handlebars.compile(pupupSource);

            i = 1;
            var $eqTable = $('#gvEvent tr:gt(0)');

            $eqTable.each(function (idx, obj) {
                var $eqInfo = $(this).children('td'),
                    eqtxt = $eqInfo.eq(0).text(),  // 編號
                    eqtime = $eqInfo.eq(1).text(), // 時間
                    eqlat = $eqInfo.eq(2).text(),  // 緯度
                    eqlon = $eqInfo.eq(3).text(),  // 經度
                    eqmag = $eqInfo.eq(4).text(),  // 規模                
                    equrl = $eqInfo.eq(7).text();  // 地震報告連結

                var DOMAIN = "http://www.cwb.gov.tw";

                if (eqlat > 21 && eqlat < 26 && eqlon > 119 && eqlon < 123) {

                    // 小圖範圍 119-123, 21-26
                    eqlat = ((26 - eqlat) / (26 - 21)) * 475;   // 小圖gif 350px*475px
                    eqlon = ((eqlon - 119) / (123 - 119)) * 350;

                    var eqmarker, type, text, url;

                    switch (eqtxt) {
                        case '小區域':
                            eqmarker = 'marker_local'; // 小區域marker的size為12px*12px
                            type = "小區域";
                            text = ""
                            eqlat = eqlat - 6;
                            eqlon = eqlon - 6;
                            url = DOMAIN + '/V7/earthquake/Data/local/' + equrl;
                            break;

                        case '遠地地震':
                            eqmarker = 'marker_number'; // 遠地比照編號 marker的size為26px*26px
                            type = "逺地地震";
                            text = "遠地"
                            eqlat = eqlat - 26;
                            eqlon = eqlon - 16;
                            url = DOMAIN + '/V7/earthquake/Data/far/' + equrl;
                            break;

                        default:

                            type = eqtxt;
                            text = eqtxt.length > 3 ? eqtxt.substr(0, 3) : eqtxt;
                            eqmarker = 'marker_number'; // 編號marker的size為26px*26px
                            eqlat = eqlat - 26;
                            eqlon = eqlon - 13;
                            url = DOMAIN + '/V7/earthquake/Data/quake/' + equrl;
                    }


                    var $marker = $('<div></div>', {
                        type: type,
                        text: text,
                        idx: idx + 1
                    })
                        .css({
                            left: eqlon + 'px',
                            top: eqlat + 'px'
                        })
                        .addClass("marker " + eqmarker)
                        .on('click', function () {
                            location.href = url;
                        });

                    $('#mainmap').prepend($marker);

                    $(this).click(function () {
                        location.href = url
                    });

                } else {

                    $(this).on('click', function () {
                        switch (eqtxt) {
                            case '小區域':
                                location.href = DOMAIN + '/V7/earthquake/Data/local/' + equrl;
                                break;
                            case '遠地地震':
                                location.href = DOMAIN + '/V7/earthquake/Data/far/' + equrl;
                                break;
                            default:
                                location.href = DOMAIN + '/V7/earthquake/Data/quake/' + equrl;
                        }
                    });

                }

                i++;
            });

            this.eqhover();

        }
    }
})().init();

