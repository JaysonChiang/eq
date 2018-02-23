// 地震列表 table id="gvEvent"

// 滑鼠移上表格或是地圖上的地震標記時
function eqhover() {
    //
    // 地圖上-----------------------------------------------------
    //
    $('.marker').hover(function () { // 滑鼠移入

        var j = $(this).attr('index');
        var num = $(this).attr('text');

        var p_left = $(this).css('left');
        p_left = p_left.substring(0, p_left.length - 2);
        p_left = p_left * 1 + 25.0;

        var p_top = $(this).css('top');
        p_top = p_top.substring(0, p_top.length - 2);
        p_top = p_top * 1 + 25.0;

        var c_time = $('#gvEvent tr:eq(' + j + ')').children('td').eq(1).text(); //取Table的時間
        var c_mag = $('#gvEvent tr:eq(' + j + ')').children('td').eq(4).text(); //取Table的規模
        var c_dep = $('#gvEvent tr:eq(' + j + ')').children('td').eq(5).text(); //取Table的深度
        var c_loc = $('#gvEvent tr:eq(' + j + ')').children('td').eq(6).text(); //取Table的位置


        // 跳出視窗內容--------------------------------------------------------------------
        var str = '<div class="popup" style="left:' + p_left + 'px; top:' + p_top + 'px">';
        str += '<table style="width:160px" class="contacts">';

        if (j == 1) {
            str += '<thead><tr><th colspan="2"> # ' + num + ' [new]</th></tr></thead>'; //最新地震
        } else {
            str += '<thead><tr><th colspan="2"> # ' + num + '</th></tr></thead>'; //其他地震
        }

        str += '<tbody>';
        str += '<tr><td>時間</td><td>' + c_time + '</td></tr>';
        str += '<tr><td>規模</td><td>' + c_mag + '</td></tr>';
        str += '<tr><td>深度</td><td>' + c_dep + '</td></tr>';
        str += '<tr><td>位置</td><td>' + c_loc + '</td></tr>';
        str += '</tbody>'
        str += '</table></div>';

        // CSS套用與移除--------------------------------------------------------------------
        $('#gvEvent tr:eq(' + j + ')').addClass('eqhover_gv');

        if (num == '小區域') {
            $(this).addClass('marker_local_over');
        } else {
            $(this).addClass('marker_number_over');
        }

        $(this).after(str);

    }, function () { // 滑鼠移出
        var j = $(this).attr('index');
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
                    $('.marker[index=' + j + ']').addClass('marker_local_over');
                }
                else {
                    $('.marker[index=' + j + ']').addClass('marker_number_over'); //包含編號地震與遠地地震
                }
            } else {
                $('#mainmap').prepend('<div class="eqoutside">　震央超出顯示範圍　</div>');
            }

        }, function () { // 滑鼠移出

            var j = $(this).index();

            $(this).removeClass('eqhover_gv');
            $('.marker[index=' + j + ']').removeClass('marker_number_over marker_local_over');
            $('.eqoutside').remove();

        });

}

// 文件setting完畢後啟動
$(document).ready(function () {

    setTimeout('eqhover()', 500);

    i = 1;

    $('#gvEvent tr:gt(0)').each(function () {

        var eqtxt = $(this).children('td').eq(0).text();  // 編號
        var eqtime = $(this).children('td').eq(1).text(); // 時間
        var eqlat = $(this).children('td').eq(2).text();  // 緯度
        var eqlon = $(this).children('td').eq(3).text();  // 經度
        var eqmag = $(this).children('td').eq(4).text();  // 規模                
        var equrl = $(this).children('td').eq(7).text();  // 地震報告連結

        var domain = "http://www.cwb.gov.tw";

        if (eqlat > 21 && eqlat < 26 && eqlon > 119 && eqlon < 123) {

            // 小圖範圍 119-123, 21-26
            eqlat = ((26 - eqlat) / (26 - 21)) * 475;   // 小圖gif 350px*475px
            eqlon = ((eqlon - 119) / (123 - 119)) * 350;


            if (eqtxt == '小區域') {

                var eqmarker = 'marker_local'; // 小區域marker的size為12px*12px

                eqlat = eqlat - 6;
                eqlon = eqlon - 6;

                var url = domain + '/V7/earthquake/Data/local/' + equrl;

                if (i == 1) {
                    $('#mainmap').prepend('<div text ="小區域" onclick="location=\'' + url + '\'" index="' + i + '" class = "marker marker_local_new" style="left:' + eqlon + 'px; top:' + eqlat + 'px"></div>');
                } else {
                    $('#mainmap').prepend('<div text ="小區域" onclick="location=\'' + url + '\'" index="' + i + '" class = "marker ' + eqmarker + '" style="left:' + eqlon + 'px; top:' + eqlat + 'px"></div>');
                }

                $(this).click(function () {
                    location.href = url;
                });

            } else if (eqtxt == '遠地地震') {
                var eqmarker = 'marker_number'; // 遠地比照編號 marker的size為26px*26px

                eqlat = eqlat - 26;
                eqlon = eqlon - 16;

                var url = domain + '/V7/earthquake/Data/far/' + equrl;

                if (i == 1) {
                    $('#mainmap').prepend('<div text ="逺地地震" onclick="location=\'' + url + '\'" index="' + i + '" class = "marker marker_number_new" style="left:' + eqlon + 'px; top:' + eqlat + 'px">遠地</div>');
                } else {
                    $('#mainmap').prepend('<div text ="遠地地震" onclick="location=\'' + url + '\'" index="' + i + '" class = "marker ' + eqmarker + '" style="left:' + eqlon + 'px; top:' + eqlat + 'px">遠地</div>');
                }

                $(this).click(function () {
                    location.href = url;
                });

            } else {
                // for PWS
                if (eqtxt.length > 3) {
                    eqtxt = eqtxt.substr(0, 3);
                }

                var eqmarker = 'marker_number'; // 編號marker的size為26px*26px

                eqlat = eqlat - 26;
                eqlon = eqlon - 13;

                var url = domain + '/V7/earthquake/Data/quake/' + equrl;

                if (i == 1) {
                    $('#mainmap').prepend('<div text ="' + eqtxt + '" onclick="location=\'' + url + '\'"  index="' + i + '" class = "marker marker_number_new" style="left:' + eqlon + 'px; top:' + eqlat + 'px">' + eqtxt + '</div>');
                } else {
                    $('#mainmap').prepend('<div text ="' + eqtxt + '" onclick="location=\'' + url + '\'"  index="' + i + '" class = "marker ' + eqmarker + '" style="left:' + eqlon + 'px; top:' + eqlat + 'px">' + eqtxt + '</div>');
                }

                $(this).click(function () {
                    location.href = url;
                });
            }
        } else {

            if (eqtxt == '小區域') {

                var url = domain + '/V7/earthquake/Data/local/' + equrl;
                $(this).click(function () {
                    location.href = url;
                });

            } else if (eqtxt == '遠地地震') {

                var url = domain + '/V7/earthquake/Data/far/' + equrl;
                $(this).click(function () {
                    location.href = url;
                });

            } else {

                var url = domain + '/V7/earthquake/Data/quake/' + equrl;
                $(this).click(function () {
                    location.href = url;
                });
            }

        }

        i++;
    });

});
