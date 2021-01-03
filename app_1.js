const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs')
const client = require('cheerio-httpcli');
const path = require('path')
const static = require('serve-static')
const cors = require('cors');

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use('/views', static(path.join(__dirname, '/views')));
app.use('/', static(path.join(__dirname, '/')));
app.use(cors());

app.use('/', (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    let id = req.query.id;
    let url = "https://codeforces.com/api/user.info?handles=" + id;
    let userInfo = {
        id: "",
        rank: "",
        rating: "",
        maxRank: "",
        maxRating: ""
    };

    const TIER_COLOR = {
        newbie: "#CBCBCB",
        pupil: "#00A800",
        specialist: "#00D9CC",
        expert: "#656AFF",
        'candidate master': "#EE00EE",
        master: "#FF8C00",
        'international master': "#FF8C00",
        grandmaster: "#FF0000",
        'international grandmaster': "#FF0000",
        'legendary grandmaster': {
            firstLetter: "#000000",
            remains: "#FF0000"
        }
    };

    const RANK_EXP = {
        newbie: {
            min: 0,
            max: 1199
        },
        pupil: {
            min: 1200,
            max: 1399
        },
        specialist: {
            min: 1400,
            max: 1599
        },
        expert: {
            min: 1600,
            max: 1899
        },
        'candidate master': {
            min: 1900,
            max: 2099
        },
        master: {
            min: 2100,
            max: 2299
        },
        'international master': {
            min: 2300,
            max: 2399
        },
        grandmaster: {
            min: 2400,
            max: 2599
        },
        'international grandmaster': {
            min: 2600,
            max: 2999
        },
        'legendary grandmaster': {
            min: 3000,
            max: 5000
        }
    };
    client.fetch(url, {}, (err, $, result) => {
        let pInfo = JSON.parse($.html()).result;
        if (pInfo == undefined) {
            console.log('no id!')
            return;
        }

        userInfo.id = id;
        userInfo.rank = pInfo[0].rank;
        userInfo.rating = pInfo[0].rating;
        userInfo.maxRank = pInfo[0].maxRank;
        userInfo.maxRating = pInfo[0].maxRating;
        // 중복호출시 userInfo.rank가 null인 상태로 호출된다
        // 왜 중복호출될까..
        if (RANK_EXP[userInfo.rank] != undefined) {
            if (userInfo.maxRank.length <= 6) {
                res.send(`
        <svg xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" width="381" height="105.309" viewBox="0 0 381 105.309">
            <g id="패스_1" data-name="패스 1" fill="#36393f">
                <path d="M 323 105.1590118408203 L 19 105.1590118408203 C 8.606082916259766 105.1590118408203 0.1500000059604645 99.68563842773438 0.1500000059604645 92.95796966552734 L 0.1500000059604645 12.35105228424072 C 0.1500000059604645 5.623385429382324 8.606082916259766 0.1500104963779449 19 0.1500104963779449 L 323 0.1500104963779449 C 333.3939208984375 0.1500104963779449 341.8500061035156 5.623385429382324 341.8500061035156 12.35105228424072 L 341.8500061035156 92.95796966552734 C 341.8500061035156 99.68563842773438 333.3939208984375 105.1590118408203 323 105.1590118408203 Z" stroke="none"/>
                <path d="M 19 0.3000106811523438 C 8.68878173828125 0.3000106811523438 0.29998779296875 5.706092834472656 0.29998779296875 12.35105133056641 L 0.29998779296875 92.95796966552734 C 0.29998779296875 99.60292816162109 8.68878173828125 105.0090103149414 19 105.0090103149414 L 323 105.0090103149414 C 333.3112182617188 105.0090103149414 341.7000122070312 99.60292816162109 341.7000122070312 92.95796966552734 L 341.7000122070312 12.35105133056641 C 341.7000122070312 5.706092834472656 333.3112182617188 0.3000106811523438 323 0.3000106811523438 L 19 0.3000106811523438 M 19 7.62939453125e-06 L 323 7.62939453125e-06 C 333.493408203125 7.62939453125e-06 342 5.529762268066406 342 12.35105133056641 L 342 92.95796966552734 C 342 99.77925872802734 333.493408203125 105.3090133666992 323 105.3090133666992 L 19 105.3090133666992 C 8.506591796875 105.3090133666992 0 99.77925872802734 0 92.95796966552734 L 0 12.35105133056641 C 0 5.529762268066406 8.506591796875 7.62939453125e-06 19 7.62939453125e-06 Z" stroke="none"/>
            </g>
            <g id="name_bar" data-name="name &amp; bar" transform="translate(-7 1)">
                <text id="Master" transform="translate(23 30)" fill="${TIER_COLOR[userInfo.rank]}" font-size="1.2em" font-family="system-ui,
                -apple-system,
                'Segoe UI',
                Roboto,
                Helvetica,
                Arial,
                sans-serif,
                'Apple Color Emoji',
                'Segoe UI Emoji'" font-weight="700"><tspan x="0" y="0">${userInfo.rank[0].toUpperCase() + userInfo.rank.substring(1)}</tspan></text>
                <text id="" transform="translate(23 38)" fill="${TIER_COLOR[userInfo.rank]}" font-size="1.6em" font-family="system-ui,
                -apple-system,
                'Segoe UI',
                Roboto,
                Helvetica,
                Arial,
                sans-serif,
                'Apple Color Emoji',
                'Segoe UI Emoji'" font-weight="700"><tspan x="0" y="20">${userInfo.id}</tspan></text>
                <rect id="사각형_2" data-name="사각형 2" width="315" height="6" transform="translate(19 73)" fill="#707070"/>
                <rect id="사각형_1" data-name="사각형 1" width="${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * 315}" height="6" transform="translate(19 73)" fill="${TIER_COLOR[userInfo.rank]}"/>
                <text id="_1300" data-name="1300" transform="translate(${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * (334 - 19) + 8} 90)" fill="${TIER_COLOR[userInfo.rank]}" font-size="11" font-family="system-ui,
                -apple-system,
                'Segoe UI',
                Roboto,
                Helvetica,
                Arial,
                sans-serif,
                'Apple Color Emoji',
                'Segoe UI Emoji'" font-weight="700"><tspan x="0" y="0">${userInfo.rating}</tspan></text>
                <text id="_1900" data-name="1900" transform="translate(311 90)" fill="${TIER_COLOR[userInfo.rank]}" font-size="11" font-family="system-ui,
                -apple-system,
                'Segoe UI',
                Roboto,
                Helvetica,
                Arial,
                sans-serif,
                'Apple Color Emoji',
                'Segoe UI Emoji'" font-weight="700"><tspan x="0" y="0">${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * (334 - 19) + 8 >= 287 ? '' : RANK_EXP[userInfo.rank]['max']}</tspan></text>
            </g>
            <g id="max" transform="translate(180 -72.573)">
                <text id="TopRating_" data-name="TopRating" transform="translate(26 132.573)" fill="#fff" font-size="0.9em" font-family="system-ui,
                -apple-system,
                'Segoe UI',
                Roboto,
                Helvetica,
                Arial,
                sans-serif,
                'Apple Color Emoji',
                'Segoe UI Emoji'" font-weight="600"><tspan x="0" y="0">TopRating</tspan><tspan x="0" y="16"></tspan></text>
                <text id="maxRank" transform="translate(26 118.573)" fill="#fff" font-size="0.9em" font-family="system-ui,
                -apple-system,
                'Segoe UI',
                Roboto,
                Helvetica,
                Arial,
                sans-serif,
                'Apple Color Emoji',
                'Segoe UI Emoji'" font-weight="600"><tspan x="0" y="0">MaxRank</tspan></text>
                <text id="Master" transform="translate(100 105.573)" fill="${TIER_COLOR[userInfo.maxRank]}" font-size="0.9em" font-family="system-ui,
                -apple-system,
                'Segoe UI',
                Roboto,
                Helvetica,
                Arial,
                sans-serif,
                'Apple Color Emoji',
                'Segoe UI Emoji'" font-weight="700"><tspan x="0" y="13">${userInfo.maxRank[0].toUpperCase() + userInfo.maxRank.substring(1)}</tspan></text>
                <text id="_2200" data-name="2200" transform="translate(100 120.573)" fill="${TIER_COLOR[userInfo.maxRank]}" font-size="0.9em" font-family="system-ui,
                -apple-system,
                'Segoe UI',
                Roboto,
                Helvetica,
                Arial,
                sans-serif,
                'Apple Color Emoji',
                'Segoe UI Emoji'" font-weight="700"><tspan x="0" y="13">${userInfo.maxRating}</tspan></text>
            </g>
        </svg>
            `)
            } else if (userInfo.maxRank.length == 10) {
                res.send(`
        <svg xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" width="381" height="105.309" viewBox="0 0 381 105.309">
            <style type="text/css">
                <![CDATA[
                    @import url(https://cdn.jsdelivr.net/npm/segoe-fonts@1.0.1/segoe-fonts.min.css);
                ]]>
            </style>
            <g id="패스_1" data-name="패스 1" fill="#36393f">
                <path d="M 323 105.1590118408203 L 19 105.1590118408203 C 8.606082916259766 105.1590118408203 0.1500000059604645 99.68563842773438 0.1500000059604645 92.95796966552734 L 0.1500000059604645 12.35105228424072 C 0.1500000059604645 5.623385429382324 8.606082916259766 0.1500104963779449 19 0.1500104963779449 L 323 0.1500104963779449 C 333.3939208984375 0.1500104963779449 341.8500061035156 5.623385429382324 341.8500061035156 12.35105228424072 L 341.8500061035156 92.95796966552734 C 341.8500061035156 99.68563842773438 333.3939208984375 105.1590118408203 323 105.1590118408203 Z" stroke="none"/>
                <path d="M 19 0.3000106811523438 C 8.68878173828125 0.3000106811523438 0.29998779296875 5.706092834472656 0.29998779296875 12.35105133056641 L 0.29998779296875 92.95796966552734 C 0.29998779296875 99.60292816162109 8.68878173828125 105.0090103149414 19 105.0090103149414 L 323 105.0090103149414 C 333.3112182617188 105.0090103149414 341.7000122070312 99.60292816162109 341.7000122070312 92.95796966552734 L 341.7000122070312 12.35105133056641 C 341.7000122070312 5.706092834472656 333.3112182617188 0.3000106811523438 323 0.3000106811523438 L 19 0.3000106811523438 M 19 7.62939453125e-06 L 323 7.62939453125e-06 C 333.493408203125 7.62939453125e-06 342 5.529762268066406 342 12.35105133056641 L 342 92.95796966552734 C 342 99.77925872802734 333.493408203125 105.3090133666992 323 105.3090133666992 L 19 105.3090133666992 C 8.506591796875 105.3090133666992 0 99.77925872802734 0 92.95796966552734 L 0 12.35105133056641 C 0 5.529762268066406 8.506591796875 7.62939453125e-06 19 7.62939453125e-06 Z" stroke="none"/>
            </g>
            <g id="name_bar" data-name="name &amp; bar" transform="translate(-7 1)">
                <text id="Master" transform="translate(23 30)" fill="${TIER_COLOR[userInfo.rank]}" font-size="16" font-family="Segoe UI Bold, Segoe UI"><tspan x="0" y="0">${userInfo.rank[0].toUpperCase() + userInfo.rank.substring(1)}</tspan></text>
                <text id="" transform="translate(23 38)" fill="${TIER_COLOR[userInfo.rank]}" font-size="26" font-family="Segoe UI Bold, Segoe UI"><tspan x="0" y="20">${userInfo.id}</tspan></text>
                <rect id="사각형_2" data-name="사각형 2" width="315" height="6" transform="translate(19 73)" fill="#707070"/>
                <rect id="사각형_1" data-name="사각형 1" width="${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * 315}" height="6" transform="translate(19 73)" fill="${TIER_COLOR[userInfo.rank]}"/>
                <text id="_1300" data-name="1300" transform="translate(${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * (334 - 19) + 8} 90)" fill="${TIER_COLOR[userInfo.rank]}" font-size="11" font-family="Segoe UI Semibold, Segoe UI" font-weight="700"><tspan x="0" y="0">${userInfo.rating}</tspan></text>
                <text id="_1900" data-name="1900" transform="translate(311 90)" fill="${TIER_COLOR[userInfo.rank]}" font-size="11" font-family="Segoe UI Semibold, Segoe UI" font-weight="700"><tspan x="0" y="0">${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * (334 - 19) + 8 >= 289 ? '' : RANK_EXP[userInfo.rank]['max']}</tspan></text>
            </g>
            <g id="max" transform="translate(165 -72.573)">
                <text id="TopRating_" data-name="TopRating" transform="translate(26 132.573)" fill="#fff" font-size="0.9em" font-family="Segoe UI Semibold, Segoe UI" font-weight="600"><tspan x="0" y="0">TopRating</tspan><tspan x="0" y="16"></tspan></text>
                <text id="maxRank" transform="translate(26 118.573)" fill="#fff" font-size="0.9em" font-family="Segoe UI Semibold, Segoe UI" font-weight="600"><tspan x="0" y="0">MaxRank</tspan></text>
                <text id="Master" transform="translate(100 105.573)" fill="${TIER_COLOR[userInfo.maxRank]}" font-size="0.9em" font-family="Segoe UI Bold, Segoe UI" font-weight="700"><tspan x="0" y="13">${userInfo.maxRank[0].toUpperCase() + userInfo.maxRank.substring(1)}</tspan></text>
                <text id="_2200" data-name="2200" transform="translate(100 120.573)" fill="${TIER_COLOR[userInfo.maxRank]}" font-size="0.9em" font-family="Segoe UI Bold, Segoe UI" font-weight="700"><tspan x="0" y="13">${userInfo.maxRating}</tspan></text>
            </g>
        </svg>
            `)
            } else if (userInfo.maxRank.length == 11) {
                res.send(`
        <svg xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" width="381" height="105.309" viewBox="0 0 381 105.309">
            <style type="text/css">
                <![CDATA[
                    @import url(https://cdn.jsdelivr.net/npm/segoe-fonts@1.0.1/segoe-fonts.min.css);
                ]]>
            </style>
            <g id="패스_1" data-name="패스 1" fill="#36393f">
                <path d="M 323 105.1590118408203 L 19 105.1590118408203 C 8.606082916259766 105.1590118408203 0.1500000059604645 99.68563842773438 0.1500000059604645 92.95796966552734 L 0.1500000059604645 12.35105228424072 C 0.1500000059604645 5.623385429382324 8.606082916259766 0.1500104963779449 19 0.1500104963779449 L 323 0.1500104963779449 C 333.3939208984375 0.1500104963779449 341.8500061035156 5.623385429382324 341.8500061035156 12.35105228424072 L 341.8500061035156 92.95796966552734 C 341.8500061035156 99.68563842773438 333.3939208984375 105.1590118408203 323 105.1590118408203 Z" stroke="none"/>
                <path d="M 19 0.3000106811523438 C 8.68878173828125 0.3000106811523438 0.29998779296875 5.706092834472656 0.29998779296875 12.35105133056641 L 0.29998779296875 92.95796966552734 C 0.29998779296875 99.60292816162109 8.68878173828125 105.0090103149414 19 105.0090103149414 L 323 105.0090103149414 C 333.3112182617188 105.0090103149414 341.7000122070312 99.60292816162109 341.7000122070312 92.95796966552734 L 341.7000122070312 12.35105133056641 C 341.7000122070312 5.706092834472656 333.3112182617188 0.3000106811523438 323 0.3000106811523438 L 19 0.3000106811523438 M 19 7.62939453125e-06 L 323 7.62939453125e-06 C 333.493408203125 7.62939453125e-06 342 5.529762268066406 342 12.35105133056641 L 342 92.95796966552734 C 342 99.77925872802734 333.493408203125 105.3090133666992 323 105.3090133666992 L 19 105.3090133666992 C 8.506591796875 105.3090133666992 0 99.77925872802734 0 92.95796966552734 L 0 12.35105133056641 C 0 5.529762268066406 8.506591796875 7.62939453125e-06 19 7.62939453125e-06 Z" stroke="none"/>
            </g>
            <g id="name_bar" data-name="name &amp; bar" transform="translate(-7 1)">
                <text id="Master" transform="translate(23 30)" fill="${TIER_COLOR[userInfo.rank]}" font-size="16" font-family="Segoe UI Bold, Segoe UI"><tspan x="0" y="0">${userInfo.rank[0].toUpperCase() + userInfo.rank.substring(1)}</tspan></text>
                <text id="" transform="translate(23 38)" fill="${TIER_COLOR[userInfo.rank]}" font-size="26" font-family="Segoe UI Bold, Segoe UI"><tspan x="0" y="20">${userInfo.id}</tspan></text>
                <rect id="사각형_2" data-name="사각형 2" width="315" height="6" transform="translate(19 73)" fill="#707070"/>
                <rect id="사각형_1" data-name="사각형 1" width="${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * 315}" height="6" transform="translate(19 73)" fill="${TIER_COLOR[userInfo.rank]}"/>
                <text id="_1300" data-name="1300" transform="translate(${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * (334 - 19) + 8} 90)" fill="${TIER_COLOR[userInfo.rank]}" font-size="11" font-family="Segoe UI Semibold, Segoe UI" font-weight="700"><tspan x="0" y="0">${userInfo.rating}</tspan></text>
                <text id="_1900" data-name="1900" transform="translate(311 90)" fill="${TIER_COLOR[userInfo.rank]}" font-size="11" font-family="Segoe UI Semibold, Segoe UI" font-weight="700"><tspan x="0" y="0">${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * (334 - 19) + 8 >= 289 ? '' : RANK_EXP[userInfo.rank]['max']}</tspan></text>
            </g>
            <g id="max" transform="translate(140 -72.573)">
                <text id="TopRating_" data-name="TopRating" transform="translate(26 132.573)" fill="#fff" font-size="0.9em" font-family="Segoe UI Semibold, Segoe UI" font-weight="600"><tspan x="0" y="0">TopRating</tspan><tspan x="0" y="16"></tspan></text>
                <text id="maxRank" transform="translate(26 118.573)" fill="#fff" font-size="0.9em" font-family="Segoe UI Semibold, Segoe UI" font-weight="600"><tspan x="0" y="0">MaxRank</tspan></text>
                <text id="Master" transform="translate(100 105.573)" fill="${TIER_COLOR[userInfo.maxRank]}" font-size="0.9em" font-family="Segoe UI Bold, Segoe UI" font-weight="700"><tspan x="0" y="13">${userInfo.maxRank[0].toUpperCase() + userInfo.maxRank.substring(1)}</tspan></text>
                <text id="_2200" data-name="2200" transform="translate(100 120.573)" fill="${TIER_COLOR[userInfo.maxRank]}" font-size="0.9em" font-family="Segoe UI Bold, Segoe UI" font-weight="700"><tspan x="0" y="13">${userInfo.maxRating}</tspan></text>
            </g>
        </svg>
            `)
            } else if (userInfo.maxRank.length == 21) {
                res.send(`
        <svg xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" width="396" height="105.309" viewBox="0 0 381 105.309">
            <style type="text/css">
                <![CDATA[
                    @import url(https://cdn.jsdelivr.net/npm/segoe-fonts@1.0.1/segoe-fonts.min.css);
                ]]>
            </style>
            <g id="패스_1" data-name="패스 1" transform="translate(0 0)">
                <path id="패스_2" data-name="패스 2" d="M366.72,105.159H21.553c-11.8,0-21.4-5.473-21.4-12.2V12.351c0-6.728,9.6-12.2,21.4-12.2H366.72c11.8,0,21.4,5.473,21.4,12.2V92.958C388.122,99.686,378.521,105.159,366.72,105.159Z" transform="translate(0 0)" fill="#36393f"/>
                <path id="패스_3" data-name="패스 3" d="M21.571.3C9.864.3.341,5.706.341,12.351V92.958c0,6.645,9.524,12.051,21.23,12.051H366.7c11.706,0,21.23-5.406,21.23-12.051V12.351C387.932,5.706,378.408.3,366.7.3H21.571m0-.3H366.7c11.913,0,21.571,5.53,21.571,12.351V92.958c0,6.821-9.658,12.351-21.571,12.351H21.571C9.658,105.309,0,99.779,0,92.958V12.351C0,5.53,9.658,0,21.571,0Z" transform="translate(0 0)" fill="#36393f"/>
            </g>
            <g id="name_bar" data-name="name &amp; bar" transform="translate(-7 1)">
                <text id="Master" transform="translate(23 30)" font-size="16" font-family="Segoe UI Bold, Segoe UI"><tspan x="0" y="0" fill="#000">L</tspan><tspan y="0" fill="#FF0000">egendary Grandmaster</tspan></text>
                <text id="" transform="translate(23 38)" font-size="26" font-family="Segoe UI Bold, Segoe UI"><tspan x="0" y="20" fill="#000">${userInfo.id[0]}</tspan><tspan y="20" fill="#FF0000">${userInfo.id.substring(1)}</tspan></text>
                <rect id="사각형_2" data-name="사각형 2" width="358" height="6" transform="translate(19 73)" fill="#707070"/>
                <rect id="사각형_1" data-name="사각형 1" width="${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * 358}" height="6" transform="translate(19 73)" fill="#FF0000"/>
                <text id="_1300" data-name="1300" transform="translate(${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * 358 + 8} 90)" fill="#FF0000" font-size="11" font-family="Segoe UI Semibold, Segoe UI" font-weight="700"><tspan x="0" y="0">${userInfo.rating}</tspan></text>
                <text id="_1900" data-name="1900" transform="translate(311 90)" fill="${TIER_COLOR[userInfo.rank]}" font-size="11" font-family="Segoe UI Semibold, Segoe UI" font-weight="700"><tspan x="0" y="0"></tspan></text>
            </g>
            <g id="max" transform="translate(200 -77.573)">
                <text id="maxRank" transform="translate(20 100)" fill="#fff" font-size="12" font-family="Segoe UI Semibold, Segoe UI"><tspan x="0" y="0">Max Rank</tspan></text>
                <text id="TopRating_" data-name="TopRating"
            transform="translate(20 126)" fill="#fff" font-size="12" font-family="Segoe UI Semibold"><tspan x="0" y="0">Top Rating</tspan><tspan font-family="Segoe UI Semibold, Segoe UI" font-weight="600"><tspan x="0" y="14"></tspan></tspan></text>
                <text id="Master-2" data-name="Master" transform="translate(20 106)" fill="legendary grandmaster" font-size="0.9em" font-family="Segoe UI Bold, Segoe UI" font-weight="700"><tspan x="0" y="6" fill="#000">L</tspan><tspan y="6" fill="#FF0000">egendary Grandmaster</tspan></text>
                <text id="_2200" data-name="2200" transform="translate(20 133)" fill="#FF0000" font-size="0.9em" font-family="Segoe UI Bold, Segoe UI" font-weight="700"><tspan x="0" y="8">${userInfo.maxRating}</tspan></text>
            </g>
        </svg>
                `)
            }
            else {
                res.send(`
        <svg xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" width="396" height="105.309" viewBox="0 0 381 105.309">
            <style type="text/css">
                <![CDATA[
                    @import url(https://cdn.jsdelivr.net/npm/segoe-fonts@1.0.1/segoe-fonts.min.css);
                ]]>
            </style>
            <g id="패스_1" data-name="패스 1" transform="translate(0 0)">
                <path id="패스_2" data-name="패스 2" d="M366.72,105.159H21.553c-11.8,0-21.4-5.473-21.4-12.2V12.351c0-6.728,9.6-12.2,21.4-12.2H366.72c11.8,0,21.4,5.473,21.4,12.2V92.958C388.122,99.686,378.521,105.159,366.72,105.159Z" transform="translate(0 0)" fill="#36393f"/>
                <path id="패스_3" data-name="패스 3" d="M21.571.3C9.864.3.341,5.706.341,12.351V92.958c0,6.645,9.524,12.051,21.23,12.051H366.7c11.706,0,21.23-5.406,21.23-12.051V12.351C387.932,5.706,378.408.3,366.7.3H21.571m0-.3H366.7c11.913,0,21.571,5.53,21.571,12.351V92.958c0,6.821-9.658,12.351-21.571,12.351H21.571C9.658,105.309,0,99.779,0,92.958V12.351C0,5.53,9.658,0,21.571,0Z" transform="translate(0 0)" fill="#36393f"/>
            </g>
            <g id="name_bar" data-name="name &amp; bar" transform="translate(-7 1)">
                <text id="Master" transform="translate(23 30)" fill="${TIER_COLOR[userInfo.rank]}" font-size="16" font-family="Segoe UI Bold, Segoe UI"><tspan x="0" y="0">${userInfo.rank[0].toUpperCase() + userInfo.rank.substring(1)}</tspan></text>
                <text id="" transform="translate(23 38)" fill="${TIER_COLOR[userInfo.rank]}" font-size="26" font-family="Segoe UI Bold, Segoe UI"><tspan x="0" y="20">${userInfo.id}</tspan></text>
                <rect id="사각형_2" data-name="사각형 2" width="358" height="6" transform="translate(19 73)" fill="#707070"/>
                <rect id="사각형_1" data-name="사각형 1" width="${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * 358}" height="6" transform="translate(19 73)" fill="${TIER_COLOR[userInfo.rank]}"/>
                <text id="_1300" data-name="1300" transform="translate(${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * 358 + 8} 90)" fill="${TIER_COLOR[userInfo.rank]}" font-size="11" font-family="Segoe UI Semibold, Segoe UI" font-weight="700"><tspan x="0" y="0">${userInfo.rating}</tspan></text>
                <text id="_1900" data-name="1900" transform="translate(365 90)" fill="${TIER_COLOR[userInfo.rank]}" font-size="11" font-family="Segoe UI Semibold, Segoe UI" font-weight="700"><tspan x="0" y="0">${(userInfo.rating - RANK_EXP[userInfo.rank]['min']) / (RANK_EXP[userInfo.rank]['max'] - RANK_EXP[userInfo.rank]['min']) * (334 - 19) + 8 >= 289 ? '' : RANK_EXP[userInfo.rank]['max']}</tspan></text>
            </g>
            <g id="max" transform="translate(200 -77.573)">
                <text id="maxRank" transform="translate(20 100)" fill="#fff" font-size="12" font-family="Segoe UI Semibold, Segoe UI"><tspan x="0" y="0">Max Rank</tspan></text>
                <text id="TopRating_" data-name="TopRating"
            transform="translate(20 126)" fill="#fff" font-size="12" font-family="Segoe UI Semibold"><tspan x="0" y="0">Top Rating</tspan><tspan font-family="Segoe UI Semibold, Segoe UI" font-weight="600"><tspan x="0" y="14"></tspan></tspan></text>
                <text id="Master-2" data-name="Master" transform="translate(20 106)" fill="${TIER_COLOR[userInfo.rank]}" font-size="0.9em" font-family="Segoe UI Bold, Segoe UI" font-weight="700"><tspan x="0" y="6">${userInfo.maxRank[0].toUpperCase() + userInfo.maxRank.substring(1)}</tspan></text>
                <text id="_2200" data-name="2200" transform="translate(20 133)" fill="${TIER_COLOR[userInfo.rank]}" font-size="0.9em" font-family="Segoe UI Bold, Segoe UI" font-weight="700"><tspan x="0" y="8">${userInfo.maxRating}</tspan></text>
            </g>
        </svg>
                `)
            }
        }
    })

    // TODO: 랭크별 경험치
    // TODO: 경험치 바


})
const server = app.listen(2021, () => {
    console.log('server has started on 2021');
})