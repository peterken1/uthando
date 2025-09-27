"use client";

import React, { useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import UserMenu from './UserMenu';
import PaymentStatus from './PaymentStatus';
import FeatureNavigation from './FeatureNavigation';

interface Question {
    id: number;
    question: { [key: string]: string };
    options: { [key: string]: string[] };
    loveLanguages: string[]; // Maps to love languages: [Words, Acts, Time, Gifts, Touch]
}

const questions: Question[] = [
    {
        id: 1,
        question: {
            en: "What makes you feel most loved by your partner?",
            sw: "Ni nini kinachokufanya ujisikie kupendwa zaidi na mwenzi wako?",
            zu: "Yini ekwenza uzizwe uthandwa kakhulu umlingani wakho?",
            xh: "Yintoni ekwenza uzive uthandwa kakhulu liqabane lakho?",
            tn: "Ke eng se se go dirang o ikutlwe o ratwa thata ke molekane wa gago?",
            af: "Wat laat jou die meeste geliefd voel deur jou maat?",
            sn: "Chii chinokuitira kuti unzwe uchidikanwa zvakanyanya nemudiwa wako?",
            luo: "Angʼo momiyo iwinjo ni ihero ahinya gi jaherani?",
            kj: "Nee che kimuche kenyit hera aeng' ak kororet?",
            ke: "Ndi zwifhio zwi itaho u vhe na muvhuso wa u fhiwa nga mufarisi wawe?",
            nd: "Yini ekwenza uzizwe uthandwa kakhulu yisithandwa sakho?",
        },
        options: {
            en: [
                "Hearing 'I love you' and other affirming words",
                "Receiving help with tasks and responsibilities",
                "Spending uninterrupted quality time together",
                "Getting thoughtful gifts and surprises",
                "Physical affection like hugs, kisses, and cuddles"
            ],
            sw: [
                "Kusikia 'Nakupenda' na maneno mengine ya kuthibitisha",
                "Kupata msaada katika kazi na majukumu",
                "Kutumia muda wa ubora pamoja bila kukatizwa",
                "Kupokea zawadi za mawazo na mshangao",
                "Upendo wa kimwili kama mikono, busu, na kukumbatia"
            ],
            zu: [
                "Ukuzwa 'Ngiyakuthanda' namanye amazwi aqinisayo",
                "Ukuthola usizo emisebenzini nasemthwalweni",
                "Ukuchitha isikhathi esihle ndawonye ngaphandle kokuphazamiseka",
                "Ukuthola izipho ezicatshangelwe nemangaliso",
                "Uthando lomzimba njengokugona, ukuphakamisa, nokugona"
            ],
            xh: [
                "'Ndiyakuthanda' namanye amazwi aqinisayo",
                "Ukufumana uncedo kwimisebenzi noxanduva",
                "Ukuchitha ixesha elililo kunye ngaphandle kokuphazamiseka",
                "Ukufumana izipho ezicingisiweyo nemangaliso",
                "Uthando lomzimba olufana nokuwola, ukuncamisa, nokubambana"
            ],
            tn: [
                "Go utlwa 'Ke a go rata' le mafoko a mangwe a tiisang",
                "Go bona thuso mo ditirong le maikarabelo",
                "Go fetsa nako ya boleng mmogo ntle le go kgaoganywa",
                "Go amogela dimpho tse di akanyeditsweng le dilo tse di gakgamatsang",
                "Lorato lwa mmele jaaka go akolola, go butsana le go kgomarelana"
            ],
            af: [
                "Om 'Ek is lief vir jou' en ander bevestigende woorde te hoor",
                "Om hulp te kry met take en verantwoordelikhede",
                "Om ononderbroke kwaliteittyd saam te spandeer",
                "Om deurdagte geskenke en verrassings te kry",
                "Fisiese liefde soos drukke, soene en knuffel"
            ],
            sn: [
                "Kunzwa 'Ndinokuda' nemamwe mazwi anosimbisa",
                "Kuwana rubatsiro mumabasa nezvaanotarisira",
                "Kupedza nguva yakanaka pamwe chete pasina kukanganiswa",
                "Kuwana zvipo zvakafungwa uye zvinoshamisa",
                "Rudo rwomuviri sekumbundira, kutsvoda, nekubatana"
            ],
            luo: [
                "Winjo 'Aheri' kod weche mamoko machielo",
                "Yudo e tije kod jotich",
                "Tiyo kinde maber kanyakla",
                "Yudo mich kod gik miwuoro",
                "Hera mar del ka rango, nyodho kod kwako"
            ],
            kj: [
                "Koyondet 'Cheruto' ak tugul che tilil",
                "Koyondet konetab tukul ak kororwek",
                "Koyondet keny che tilil tugul",
                "Koyondet sinendet ak tugul che mamuren",
                "Hera nebo kama koyondet, chupet ak koyondet"
            ],
            ke: [
                "U tshi pfa 'Ndi a ni funa' na maipfi mangwe a khwaṱhisaho",
                "U wana thuso kha mishumo na vhudifhinduleli",
                "U fhedzisa tshifhinga tsha ndeme na mufarisi nga u sa khou khakhiwa",
                "U wana zwipho zwo nangwaho na zwo farisaho",
                "Lufuno lwa mmili sa u angaredza, u tshinyela na u khomelela"
            ],
            nd: [
                "Ukuzwa 'Ngiyakuthanda' namanye amazwi aqinisayo",
                "Ukuthola usizo emisebenzini nasemthwalweni",
                "Ukuchitha isikhathi esihle ndawonye ngaphandle kokuphazamiseka",
                "Ukuthola izipho ezicatshangelwe nemangaliso",
                "Uthando lomzimba njengokugona, ukuphakamisa, nokugona"
            ]
        },
        loveLanguages: ["Words", "Acts", "Time", "Gifts", "Touch"]
    },
    {
        id: 2,
        question: {
            en: "When you're feeling disconnected from your partner, what would help most?",
            sw: "Unapojisikia umetenganishwa na mwenzi wako, ni nini kingekusaidia zaidi?",
            zu: "Uma uzizwa ungaxhumani nomlingani wakho, yini engakusiza kakhulu?",
            xh: "Xa uziva ungadityanisiwe neqabane lakho, yintoni enokukunceda kakhulu?",
            tn: "Fa o ikutlwa o sa golagane le molekane wa gago, ke eng se se ka go thusang thata?",
            af: "Wanneer jy voel jy is nie verbind met jou maat nie, wat sal die meeste help?",
            sn: "Kana uchizvinzwa usina kubatana nemudiwa wako, chii chingakubatsira zvakanyanya?",
            luo: "Ka iwinjo ni ok iriwore gi jaherani, angʼo manyalo konyi ahinya?",
            kj: "Koyondet ma ok imuche tugul ak kororet, nee che kimuche keny aeng'?",
            ke: "Arali ni tshi pfesesa uri a ni na vhukwamani na mufarisi waṋu, ndi zwifhio zwi nga ni thusaho?",
            nd: "Uma uzizwa ungaxhumani nesithandwa sakho, yini engakusiza kakhulu?"
        },
        options: {
            en: [
                "Having an honest conversation about your feelings",
                "Your partner doing something helpful without being asked",
                "Planning a special date or activity together",
                "Receiving a meaningful gift or gesture",
                "Physical closeness and intimacy"
            ],
            sw: [
                "Kuwa na mazungumzo ya kweli kuhusu hisia zako",
                "Mwenzi wako kufanya kitu cha kusaidia bila kuombwa",
                "Kupanga tarehe au shughuli maalum pamoja",
                "Kupokea zawadi au ishara yenye maana",
                "Ukaribu wa kimwili na mahusiano ya karibu"
            ],
            zu: [
                "Ukuba nengxoxo eqotho ngezizwa zakho",
                "Umlingani wakho enze into esizayo ngaphandle kokucelwa",
                "Ukuhlela usuku olukhethekile noma umsebenzi ndawonye",
                "Ukuthola isipho esinentsingiselo noma isenzo",
                "Ukusondela komzimba nobuhlobo"
            ],
            xh: [
                "Ukuba nencoko enyanisekileyo ngeemvakalelo zakho",
                "Iqabane lakho lisenza into encedisayo ngaphandle kokucelwa",
                "Ukucwangcisa umhla okhethekileyo okanye umsebenzi kunye",
                "Ukufumana isipho esinentsingiselo okanye isenzo",
                "Ukusondela komzimba nobuhlobo"
            ],
            tn: [
                "Go nna le puisano ya nnete ka ga maikutlo a gago",
                "Molekane wa gago a dira sengwe se se thusang ntle le go kgopelwa",
                "Go rulaganya letlha le le kgethegileng kgotsa tiro mmogo",
                "Go amogela mpho e e nang le bokao kgotsa tshupetso",
                "Go atamalana ga mmele le go atamalana"
            ],
            af: [
                "Om 'n eerlike gesprek oor jou gevoelens te hê",
                "Jou maat doen iets helpends sonder om gevra te word",
                "Beplan 'n spesiale datum of aktiwiteit saam",
                "Om 'n betekenisvolle geskenk of gebaar te ontvang",
                "Fisiese nabyheid en intimiteit"
            ],
            sn: [
                "Kuva nehurukuro yechokwadi nezvamunonzwa",
                "Mudiwa wako achiita chimwe chinhu chinobatsira asina kukumbira",
                "Kuronga zuva kana chiitiko chakakosha pamwe chete",
                "Kuwana chipo chine chirevo kana chiratidzo",
                "Kuswedera kwomuviri nehukama"
            ],
            luo: [
                "Bedo gi wuoyo madiera kuom gima iwinjo",
                "Jaherani otimo gimoro makonyo ma ok okwaye",
                "Chano odiechieng' maber kata tich kaachiel",
                "Yudo gima nigi tiende kata ranyisi",
                "Bedo machiegni gi del kod hera"
            ],
            kj: [
                "Koyondet tugul che tilil nebo keny che inyoru",
                "Kororet ne kityo tugul che konetab ma ok ikwani",
                "Koyondet betut nebo tukul che tilil tugul",
                "Koyondet sinendet nebo ranyik che tilil",
                "Koyondet machon ak del kod hera"
            ],
            ke: [
                "U vha na khongolose ya vhukuma nga ha zwo ni pfiswaho",
                "Mufarisi waṋu a ita zwinwe zwi thusaho nga u sa khou vhudzwa",
                "U runga ḓuvha ḽo khethekaho kana mushumo nga u kongolose",
                "U wana tshiṱalifho tshine tsha vha na ndivho kana tshiga",
                "U swikela ha mmili na vhukwamani"
            ],
            nd: [
                "Ukuba nengxoxo eqotho ngezizwa zakho",
                "Isithandwa sakho senze into esizayo ngaphandle kokucelwa",
                "Ukuhlela usuku olukhethekile noma umsebenzi ndawonye",
                "Ukuthola isipho esinentsingiselo noma isenzo",
                "Ukusondela komzimba nobuhlobo"
            ]
        },
        loveLanguages: ["Words", "Acts", "Time", "Gifts", "Touch"]
    },
    {
        id: 3,
        question: {
            en: "What type of gesture from your partner means the most to you?",
            sw: "Ni aina gani ya ishara kutoka kwa mwenzi wako inayomaanisha mengi kwako?",
            zu: "Hlobo luni lwesenzo esivela kumlingani wakho oluchaza kakhulu kuwe?",
            xh: "Loluphi uhlobo lwesenzo esivela kwiQabane lakho oluthetha kakhulu kuwe?",
            tn: "Ke mofuta ofe wa tshupetso go tswa mo molekaneng wa gago o o reng thata mo go wena?",
            af: "Watter tipe gebaar van jou maat beteken die meeste vir jou?",
            sn: "Rudzi rwupi rwechiratidzo kubva kumudiwa wako runoreva zvakanyanya kwauri?",
            luo: "En kit ranyisi moa kuom jaherani manyalo ahinya ne?",
            kj: "Kit eng' nebo ranyik moa kou kororet ne kimuche keny aeng'?",
            ke: "Ndi mutheo ufhio wa tshiga u bvaho kha mufarisi waṋu une wa vha na ndeme khulwane kha iṋu?",
            nd: "Hlobo luni lwesenzo esivela esithandweni sakho oluchaza kakhulu kuwe?"
        },
        options: {
            en: [
                "A heartfelt compliment or encouraging message",
                "Taking care of something you've been worried about",
                "Giving you their full attention when you're together",
                "A small but thoughtful surprise",
                "A warm hug or gentle touch when you need it"
            ],
            sw: [
                "Sifa za dhati au ujumbe wa kuhamasisha",
                "Kushughulikia kitu ambacho umekuwa ukijali",
                "Kukupa umakini wao kamili mnapokuwa pamoja",
                "Mshangao mdogo lakini wa mawazo",
                "Mkono wa joto au mguso wa upole unapohitaji"
            ],
            zu: [
                "Ukuncoma okuvela enhliziyweni noma umlayezo okhuthazayo",
                "Ukunakekela into obuke wayikhathazeka ngayo",
                "Ukukunika ukunaka kwabo okuphelele uma nindawonye",
                "Isimangaliso esincane kodwa esicatshangelwe",
                "Ukugona okufudumele noma ukuthinta kamnene uma ukudinga"
            ],
            xh: [
                "Uncomo oluvela entliziyweni okanye umyalezo okhuthazayo",
                "Ukukhathalela into obuke waxhalabela ngayo",
                "Ukukunika ingqalelo yabo epheleleyo xa nindawonye",
                "Isimangaliso esincinci kodwa esicingisiweyo",
                "Ukuwola okufudumeleyo okanye ukuchukumisa ngobubele xa ukufuna"
            ],
            tn: [
                "Kgakololo ya pelo kgotsa molaetsa o o rotloetsang",
                "Go tlhokomela sengwe se o neng o tshwenyegile ka sone",
                "Go go naya tlhokomelo ya bone yotlhe fa lo le mmogo",
                "Sengwe se se gakgamatsang se se nnye fela mme se se akantsweng",
                "Kgomarelano e e bothitho kgotsa go ama ka bonolo fa o se tlhoka"
            ],
            af: [
                "'n Hartlike kompliment of bemoedigende boodskap",
                "Om iets te versorg waaroor jy bekommerd was",
                "Om jou hul volle aandag te gee wanneer julle saam is",
                "'n Klein maar deurdagte verrassing",
                "'n Warm drukkie of sagte aanraking wanneer jy dit nodig het"
            ],
            sn: [
                "Kurumbidza kunobva mumoyo kana meseji inokurudzira",
                "Kuchengeta chimwe chinhu chawanga uchishushikana nacho",
                "Kukupa kutarisisa kwavo kuzere kana muri pamwe chete",
                "Chishamiso chidiki asi chakafungwa",
                "Kubatana kunodziya kana kubata zvakapfava kana uchizvidira"
            ],
            luo: [
                "Pak ma aa e chuny kata ote manyalo chuny",
                "Rito gimoro mane iparore",
                "Miyou paro margi duto ka un kaachiel",
                "Gima matin to moparo maber",
                "Rango manyalo chuny kata mulo mayom ka idwaro"
            ],
            kj: [
                "Pak che tilil nebo ote che koyondet chuny",
                "Koyondet tugul che ne iparori",
                "Miyou paro margi duto ka un kaachiel",
                "Tugul che matin to moparo maber",
                "Koyondet manyalo chuny kata mulo mayom ka idwaro"
            ],
            ke: [
                "Mbongoledzo yo bvaho moyoni kana melaedza ya u khwaṱhisa",
                "U ita zwinwe zwine na vha ni tshi khou farela",
                "U ni ṋea ṱhoho yavho yoṱhe arali ni na u kongolose",
                "Tshifariwa tshine tsha vha tshiṱuku fhedzi tshine tsha vha tsha nangwa",
                "U angaredza ha fhufhi kana u khou amba nga vhutshilo arali ni tshi khou ṱoḓa"
            ],
            nd: [
                "Ukuncoma okuvela enhliziyweni noma umlayezo okhuthazayo",
                "Ukunakekela into obuke wayikhathazeka ngayo",
                "Ukukunika ukunaka kwabo okuphelele uma nindawonye",
                "Isimangaliso esincane kodwa esicatshangelwe",
                "Ukugona okufudumele noma ukuthinta kamnene uma ukudinga"
            ]
        },
        loveLanguages: ["Words", "Acts", "Time", "Gifts", "Touch"]
    },
    {
        id: 4,
        question: {
            en: "How do you prefer to show love to your partner?",
            sw: "Unapendelea kuonyesha upendo kwa mwenzi wako vipi?",
            zu: "Ukhetha kanjani ukubonisa uthando kumlingani wakho?",
            xh: "Ukhetha njani ukubonisa uthando kwiQabane lakho?",
            tn: "O rata go bontsha lorato mo molekaneng wa gago jang?",
            af: "Hoe verkies jy om liefde aan jou maat te toon?",
            sn: "Unoda kuratidza rudo kune mudiwa wako sei?",
            luo: "Ere idwaro nyiso hera ne jaherani kaka?",
            kj: "Koyondet hera ne kororet kaka?",
            ke: "Ni nga ndila ifhio ine na khetha u sumbedza lufuno kha mufarisi waṋu?",
            nd: "Ukhetha kanjani ukubonisa uthando esithandweni sakho?"
        },
        options: {
            en: [
                "Telling them how much they mean to you",
                "Doing things to make their life easier",
                "Spending focused time together without distractions",
                "Giving them things that show you were thinking of them",
                "Being physically affectionate and close"
            ],
            sw: [
                "Kuwaambia jinsi wanavyomaanisha kwako",
                "Kufanya mambo ya kurahisisha maisha yao",
                "Kutumia muda wa kuzingatia pamoja bila kutatanishwa",
                "Kuwapa vitu vinavyoonyesha ulikuwa ukiwaza juu yao",
                "Kuwa na upendo wa kimwili na karibu"
            ],
            zu: [
                "Ukubatshela ukuthi basho malini kuwe",
                "Ukwenza izinto zokwenza impilo yabo ibe lula",
                "Ukuchitha isikhathi esigxile ndawonye ngaphandle kokuphazamiseka",
                "Ukubanika izinto ezibonisa ukuthi ubucabanga ngabo",
                "Ukuba nothando lomzimba nokusondela"
            ],
            xh: [
                "Ukubaxelela ukuba bathetha ntoni kuwe",
                "Ukwenza izinto zokwenza ubomi babo bube lula",
                "Ukuchitha ixesha eligxininisiweyo kunye ngaphandle kokuphazamiseka",
                "Ukubanika izinto ezibonisa ukuba ubucinga ngabo",
                "Ukuba nothando lomzimba nokusondela"
            ],
            tn: [
                "Go ba bolelela gore ba kaya eng mo go wena",
                "Go dira dilo tse di dirang botshelo jwa bone bo nne bonolo",
                "Go fetsa nako e e lebantsweng mmogo ntle le go kgaoganywa",
                "Go ba naya dilo tse di bontshang gore o ne o ba akanya",
                "Go nna le lorato lwa mmele le go atamalana"
            ],
            af: [
                "Om vir hulle te sê hoeveel hulle vir jou beteken",
                "Om dinge te doen om hul lewe makliker te maak",
                "Om gefokusde tyd saam te spandeer sonder afleidings",
                "Om vir hulle goed te gee wat wys jy het aan hulle gedink",
                "Om fisies liefdevol en naby te wees"
            ],
            sn: [
                "Kuvaudza kuti vanoreva zvakadii kwauri",
                "Kuita zvinhu zvinoita kuti hupenyu hwavo huve nyore",
                "Kupedza nguva yakatarisa pamwe chete pasina zvinokanganisa",
                "Kuvapa zvinhu zvinoratidza kuti wanga uchivafunga",
                "Kuva nerudo rwomuviri uye pedyo"
            ],
            luo: [
                "Nyisogi kaka gima gitiekogi",
                "Timo gik manyalo ngimagi yot bedo mayot",
                "Tiyo kinde maber kanyakla ma ok gimoro kelo chandruok",
                "Miyogi gik manyalo ni paro margi",
                "Bedo gi hera mar del kod bedo machiegni"
            ],
            kj: [
                "Koyondet kaka tugul che kimuche keny",
                "Kityo tugul che konetab ngimagi yot bedo mayot",
                "Tiyo kinde maber kanyakla ma ok gimoro kelo chandruok",
                "Miyogi gik manyalo ni paro margi",
                "Bedo gi hera mar del kod bedo machiegni"
            ],
            ke: [
                "U vha vhudza uri vha amba mini kha iṋu",
                "U ita zwinwe zwi itaho uri vhutshilo havho hu vhe ho ralo",
                "U fhedzisa tshifhinga tsho dzhiaho nga u kongolose ntsho u sa khou khakhiwa",
                "U vha ṋea zwinwe zwi sumbedzaho uri no vha vha tshi khou humbula",
                "U vha na lufuno lwa mmili na u vha hufhio"
            ],
            nd: [
                "Ukubatshela ukuthi basho malini kuwe",
                "Ukwenza izinto zokwenza impilo yabo ibe lula",
                "Ukuchitha isikhathi esigxile ndawonye ngaphandle kokuphazamiseka",
                "Ukubanika izinto ezibonisa ukuthi ubucabanga ngabo",
                "Ukuba nothando lomzimba nokusondela"
            ]
        },
        loveLanguages: ["Words", "Acts", "Time", "Gifts", "Touch"]
    },
    {
        id: 5,
        question: {
            en: "What would hurt your feelings most in a relationship?",
            sw: "Ni nini kingekuumiza hisia zako zaidi katika uhusiano?",
            zu: "Yini engakuhlukumeza kakhulu ezizweni zakho ebudlelwaneni?",
            xh: "Yintoni enokukuhlukumeza kakhulu kwiimvakalelo zakho ebudlelwaneni?",
            tn: "Ke eng se se ka go utlwisang botlhoko thata mo kamanong?",
            af: "Wat sou jou gevoelens die meeste seermaak in 'n verhouding?",
            sn: "Chii chingakuvadza zvakanyanya mumanzwiro ako muhukama?",
            luo: "Angʼo manyalo hinyi ahinya e kanyakla?",
            kj: "Nee che kimuche hinyit aeng' ak kanyakla?",
            ke: "Ndi zwifhio zwi nga ni vhavhadza nga maanḓa kha mipfesele yaṋu kha vhukwamani?",
            nd: "Yini engakuhlukumeza kakhulu ezizweni zakho ebudlelwaneni?"
        },
        options: {
            en: [
                "Being criticized or receiving harsh words",
                "Your partner not helping when you clearly need it",
                "Being ignored or not given quality time",
                "Being forgotten on special occasions",
                "Lack of physical affection or intimacy"
            ],
            sw: [
                "Kukosolewa au kupokea maneno makali",
                "Mwenzi wako asikusaidie unapohitaji wazi",
                "Kupuuzwa au kutopewa muda wa ubora",
                "Kusahaulika katika matukio maalum",
                "Ukosefu wa upendo wa kimwili au mahusiano ya karibu"
            ],
            zu: [
                "Ukugxekwa noma ukuthola amazwi abuhlungu",
                "Umlingani wakho engakusizi uma udinga ngokucacile",
                "Ukuzishwa noma unganikezwa isikhathi esihle",
                "Ukukhohlakala ezikhathini ezikhethekile",
                "Ukuntuleka kothando lomzimba noma ubuhlobo"
            ],
            xh: [
                "Ukugxekwa okanye ukufumana amazwi abuhlungu",
                "Iqabane lakho lingakuncedi xa ucacile ukuba uyalufuna uncedo",
                "Ukungahoywa okanye unganikezelwa ixesha elililo",
                "Ukulityalwa ngezikhathi ezikhethekileyo",
                "Ukungabikho kothando lomzimba okanye ubuhlobo"
            ],
            tn: [
                "Go solofelwa kgotsa go amogela mafoko a a bogale",
                "Molekane wa gago a sa go thuse fa o tlhoka thuso ka tlhagafalo",
                "Go sa tseywa tlhoko kgotsa go sa neelwa nako ya boleng",
                "Go lebalesegwa mo ditiragalong tse di kgethegileng",
                "Go tlhoka lorato lwa mmele kgotsa go atamalana"
            ],
            af: [
                "Om gekritiseer te word of harde woorde te ontvang",
                "Jou maat help nie wanneer jy dit duidelik nodig het nie",
                "Om geïgnoreer te word of nie kwaliteittyd gegee te word nie",
                "Om vergeet te word op spesiale geleenthede",
                "Gebrek aan fisiese liefde of intimiteit"
            ],
            sn: [
                "Kushorwa kana kuwana mazwi anorwadza",
                "Mudiwa wako asingakubatsiri kana uchizvidira pachena",
                "Kushayirwa hanya kana kusapiwa nguva yakanaka",
                "Kukanganwikwa pazviitiko zvakakosha",
                "Kushaikwa rudo rwomuviri kana hukama"
            ],
            luo: [
                "Kwer kata yudo weche malit",
                "Jaherani ok konyi ka idwaro kony maler",
                "Wil kata ok mi kinde maber",
                "Wil e kinde madongo",
                "Onge hera mar del kata terruok machiegni"
            ],
            kj: [
                "Kwer kata yudo weche malit",
                "Kororet ok konyi ka idwaro kony maler",
                "Wil kata ok mi kinde maber",
                "Wil e kinde madongo",
                "Onge hera mar del kata terruok machiegni"
            ],
            ke: [
                "U sololwa kana u wana maipfi o tanyaho",
                "Mufarisi waṋu a sa ni thusi arali ni tshi khou ṱoḓa thuso nga u khagala",
                "U sa dzhielwa nṱha kana u sa ṋeelwa tshifhinga tsha ndeme",
                "U livhanywa nga tshifhinga tsha ndeme",
                "U sa vha na lufuno lwa mmili kana vhukwamani"
            ],
            nd: [
                "Ukugxekwa noma ukuthola amazwi abuhlungu",
                "Isithandwa sakho singakusizi uma udinga ngokucacile",
                "Ukuzishwa noma unganikezwa isikhathi esihle",
                "Ukukhohlakala ezikhathini ezikhethekile",
                "Ukuntuleka kothando lomzimba noma ubuhlobo"
            ]
        },
        loveLanguages: ["Words", "Acts", "Time", "Gifts", "Touch"]
    }
];

const loveLanguageDescriptions = {
    "Words": {
        en: "Words of Affirmation - You feel most loved through verbal expressions of love, appreciation, and encouragement.",
        sw: "Maneno ya Kuthibitisha - Unahisi kupendwa zaidi kupitia maneno ya upendo, kuthamini, na kuhamasisha.",
        zu: "Amazwi Aqinisayo - Uzizwa uthandwa kakhulu ngamazwi othando, ukwazisa, nokukhuthaza.",
        xh: "Amazwi Aqinisayo - Uziva uthandwa kakhulu ngamazwi othando, ukuxabisa, nokukhuthaza.",
        tn: "Mafoko a Tiiso - O ikutlwa o ratwa thata ka mafoko a lorato, tlotlo le kgothatso.",
        af: "Woorde van Bevestiging - Jy voel die meeste geliefd deur verbale uitdrukkings van liefde, waardering en aanmoediging.",
        sn: "Mazwi Anosimbisa - Unozvinzwa uchidikanwa zvakanyanya kuburikidza nemazwi erudo, kukoshesa, nekukurudzira.",
        luo: "Weche mag Jiwo - Iwinjo ni ihero ahinya kuom weche mag hera, pak kod jiwo.",
        kj: "Tugul che Tilil - Koyondet hera aeng' kuom tugul che hera, pak ak jiwo.",
        ke: "Maipfi a Khwaṱhiso - Ni pfesesa lufuno nga maipfi a lufuno, u khwaṱhisa na u khwaṱhisa.",
        nd: "Amazwi Aqinisayo - Uzizwa uthandwa kakhulu ngamazwi othando, ukuxabisa, nokukhuthaza."
    },
    "Acts": {
        en: "Acts of Service - You feel most loved when your partner does helpful things for you.",
        sw: "Matendo ya Huduma - Unahisi kupendwa zaidi wakati mwenzi wako anakufanyia mambo ya kusaidia.",
        zu: "Izenzo Zosizo - Uzizwa uthandwa kakhulu uma umlingani wakho ekwenzela izinto ezikusizayo.",
        xh: "Izenzo Zoncedo - Uziva uthandwa kakhulu xa iqabane lakho likwenzela izinto ezikuncedayo.",
        tn: "Ditiro tsa Tirelo - O ikutlwa o ratwa thata fa molekane wa gago a go direla dilo tse di go thusang.",
        af: "Dade van Diens - Jy voel die meeste geliefd wanneer jou maat nuttige dinge vir jou doen.",
        sn: "Zviito Zvebasa - Unozvinzwa uchidikanwa zvakanyanya kana mudiwa wako achikuitira zvinhu zvinokubatsira.",
        luo: "Tije mag Tich - Iwinjo ni ihero ahinya ka jaherani otimoni gik makonyi.",
        kj: "Tukul che Konetab - Koyondet hera aeng' ka kororet ne kitimchi tugul che konetab.",
        ke: "Mishumo ya Thuso - Ni pfesesa lufuno nga maanḓa arali mufarisi waṋu a tshi ni itela zwinwe zwi ni thusaho.",
        nd: "Izenzo Zosizo - Uzizwa uthandwa kakhulu uma isithandwa sakho sikwenzela izinto ezikusizayo."
    },
    "Time": {
        en: "Quality Time - You feel most loved through focused, uninterrupted time together.",
        sw: "Muda wa Ubora - Unahisi kupendwa zaidi kupitia muda wa kuzingatia, usiokatizwa pamoja.",
        zu: "Isikhathi Esihle - Uzizwa uthandwa kakhulu ngesikhathi esigxile, esingaphazanyiswanga ndawonye.",
        xh: "Ixesha Elililo - Uziva uthandwa kakhulu ngexesha eligxininisiweyo, elingaphazanyiswanga kunye.",
        tn: "Nako ya Boleng - O ikutlwa o ratwa thata ka nako e e lebantsweng, e e sa kgaoganywang mmogo.",
        af: "Kwaliteittyd - Jy voel die meeste geliefd deur gefokusde, ononderbroke tyd saam.",
        sn: "Nguva Yakanaka - Unozvinzwa uchidikanwa zvakanyanya kuburikidza nenguva yakatarisa, isingakanganiswe pamwe chete.",
        luo: "Kinde Maber - Iwinjo ni ihero ahinya kuom kinde mopog, ma ok chandruok kaachiel.",
        kj: "Keny che Tilil - Koyondet hera aeng' kuom keny che pog, che ma ok chandruok tugul.",
        ke: "Tshifhinga tsha Ndeme - Ni pfesesa lufuno nga maanḓa nga tshifhinga tsho dzhiaho, tshine tsa sa khakhiwa nga u kongolose.",
        nd: "Isikhathi Esihle - Uzizwa uthandwa kakhulu ngesikhathi esigxile, esingaphazanyiswanga ndawonye."
    },
    "Gifts": {
        en: "Receiving Gifts - You feel most loved through thoughtful gifts and gestures.",
        sw: "Kupokea Zawadi - Unahisi kupendwa zaidi kupitia zawadi za mawazo na ishara.",
        zu: "Ukuthola Izipho - Uzizwa uthandwa kakhulu ngezipho ezicatshangelwe nezenzo.",
        xh: "Ukufumana Izipho - Uziva uthandwa kakhulu ngezipho ezicingisiweyo nezenzo.",
        tn: "Go Amogela Dimpho - O ikutlwa o ratwa thata ka dimpho tse di akanyeditsweng le ditshupetso.",
        af: "Ontvang Geskenke - Jy voel die meeste geliefd deur deurdagte geskenke en gebare.",
        sn: "Kuwana Zvipo - Unozvinzwa uchidikanwa zvakanyanya kuburikidza nezvipo zvakafungwa nezviratidzo.",
        luo: "Yudo Mich - Iwinjo ni ihero ahinya kuom mich moparo kod ranyisi.",
        kj: "Koyondet Sinendet - Koyondet hera aeng' kuom sinendet che paro ak ranyik.",
        ke: "U Wana Zwipho - Ni pfesesa lufuno nga maanḓa nga zwipho zwo nangwaho na zwitshiga.",
        nd: "Ukuthola Izipho - Uzizwa uthandwa kakhulu ngezipho ezicatshangelwe nezenzo."
    },
    "Touch": {
        en: "Physical Touch - You feel most loved through physical affection and closeness.",
        sw: "Kuguswa kwa Kimwili - Unahisi kupendwa zaidi kupitia upendo wa kimwili na ukaribu.",
        zu: "Ukuthintana Komzimba - Uzizwa uthandwa kakhulu ngothando lomzimba nokusondela.",
        xh: "Ukuchukumisa Komzimba - Uziva uthandwa kakhulu ngothando lomzimba nokusondela.",
        tn: "Go Ama ga Mmele - O ikutlwa o ratwa thata ka lorato lwa mmele le go atamalana.",
        af: "Fisiese Aanraking - Jy voel die meeste geliefd deur fisiese liefde en nabyheid.",
        sn: "Kubatana Kwomuviri - Unozvinzwa uchidikanwa zvakanyanya kuburikidza nerudo rwomuviri nekuswedera.",
        luo: "Mulo mar Del - Iwinjo ni ihero ahinya kuom hera mar del kod bedo machiegni.",
        kj: "Mulo nebo Del - Koyondet hera aeng' kuom hera nebo del ak bedo machiegni.",
        ke: "U Khou Amba ha Mmili - Ni pfesesa lufuno nga maanḓa nga lufuno lwa mmili na u swikela.",
        nd: "Ukuthintana Komzimba - Uzizwa uthandwa kakhulu ngothando lomzimba nokusondela."
    }
};

export default function LoveLanguageQuizNew() {
    const [language, setLanguage] = useState("en");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [loveLanguageResult, setLoveLanguageResult] = useState<string>("");
    const [shareMessage, setShareMessage] = useState<string>("");

    const { user } = useAuth();

    const handleAnswerSelect = (optionIndex: number) => {
        const updated = [...answers];
        updated[currentQuestion] = optionIndex;
        setAnswers(updated);

        // Auto-advance to next question after a short delay
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            }
        }, 300);
    };

    const calculateLoveLanguage = () => {
        const scores = { Words: 0, Acts: 0, Time: 0, Gifts: 0, Touch: 0 };

        answers.forEach((answerIndex, questionIndex) => {
            if (answerIndex !== undefined && questions[questionIndex]) {
                const loveLanguage = questions[questionIndex].loveLanguages[answerIndex];
                scores[loveLanguage as keyof typeof scores]++;
            }
        });

        // Find the love language with the highest score
        const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const topLoveLanguage = sortedScores[0][0];

        // Log scores for debugging (can be removed in production)
        console.log('Love Language Scores:', scores);
        console.log('Top Love Language:', topLoveLanguage);

        return topLoveLanguage;
    };

    const handleSubmit = async () => {
        const result = calculateLoveLanguage();
        setLoveLanguageResult(result);

        // Save quiz results to localStorage and database
        const quizData = {
            answers,
            loveLanguage: result,
            language,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('quizResults', JSON.stringify(quizData));

        if (user) {
            try {
                await fetch('/api/save-quiz-results', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        loveLanguage: result,
                        responses: answers,
                        language
                    })
                });
            } catch (error) {
                console.error('Failed to save quiz results:', error);
            }
        }

        setSubmitted(true);
    };

    const handleShareResults = async (platform: 'whatsapp' | 'copy') => {
        const description = loveLanguageDescriptions[loveLanguageResult as keyof typeof loveLanguageDescriptions];
        const localizedDescription = description ? description[language as keyof typeof description] || description.en : '';

        const shareText = `🎉 I just discovered my Love Language! 

My primary love language is: ${loveLanguageResult}

${localizedDescription}

Understanding love languages helps us communicate love more effectively! 💕

Take the quiz yourself: ${window.location.origin}/quiz

#LoveLanguage #Uthando #Relationships`;

        if (platform === 'whatsapp') {
            const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
            window.open(url, '_blank');
        } else if (platform === 'copy') {
            try {
                await navigator.clipboard.writeText(shareText);
                setShareMessage("Results copied to clipboard! 📋");
                setTimeout(() => setShareMessage(""), 3000);
            } catch (err) {
                setShareMessage("Failed to copy. Please try again.");
                setTimeout(() => setShareMessage(""), 3000);
            }
        }
    };

    const handleBackToHome = () => {
        window.location.href = "/";
    };

    const handleGoToLoveDoctor = () => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        window.location.href = "/love-doctor";
    };

    const handleGenerateLoveNote = () => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        window.location.href = "/";
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-pink-50 text-gray-900 px-4 py-6">
            <PaymentStatus />

            <div className="max-w-md mx-auto">
                {/* Header with User Menu */}
                <div className="flex justify-between items-center mb-6">
                    <div></div>
                    <h2 className="text-2xl font-bold text-center">
                        💖 Discover Your Love Language
                    </h2>
                    <UserMenu />
                </div>

                {/* Feature Navigation */}
                <FeatureNavigation
                    currentFeature="quiz"
                    onAuthRequired={() => setShowAuthModal(true)}
                />

                {!submitted ? (
                    <>
                        {/* Language Selector */}
                        <div className="mb-6">
                            <label htmlFor="language-select" className="block text-pink-700 font-medium mb-2">
                                Select Language:
                            </label>
                            <select
                                id="language-select"
                                className="w-full p-2 border border-pink-300 rounded-lg"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option value="en">English</option>
                                <option value="sw">Swahili</option>
                                <option value="zu">Zulu</option>
                                <option value="xh">Xhosa</option>
                                <option value="tn">Tswana</option>
                                <option value="af">Afrikaans</option>
                                <option value="sn">Shona</option>
                                <option value="luo">Dholuo (Luo)</option>
                                <option value="kj">Kalenjin</option>
                                <option value="ke">Tshivenda</option>
                                <option value="nd">Ndebele</option>
                            </select>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Question {currentQuestion + 1} of {questions.length}</span>
                                <span>{Math.round(progress)}% Complete</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Current Question */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                {questions[currentQuestion]?.question[language]}
                            </h3>

                            <div className="space-y-3">
                                {questions[currentQuestion]?.options[language]?.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${answers[currentQuestion] === index
                                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                                            : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-25'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${answers[currentQuestion] === index
                                                ? 'border-pink-500 bg-pink-500'
                                                : 'border-gray-300'
                                                }`}>
                                                {answers[currentQuestion] === index && (
                                                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                                )}
                                            </div>
                                            <span className="text-sm">{option}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                                className="px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                ← Previous
                            </button>

                            {currentQuestion === questions.length - 1 && answers[currentQuestion] !== undefined ? (
                                <button
                                    onClick={handleSubmit}
                                    className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                >
                                    Get My Results
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                                    disabled={currentQuestion === questions.length - 1 || answers[currentQuestion] === undefined}
                                    className="px-4 py-2 text-pink-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    Next →
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="mt-6 bg-green-100 border border-green-300 text-green-800 text-sm rounded-lg p-6">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-green-700 mb-2">
                                🎉 Your Love Language Result
                            </h3>
                            <div className="text-2xl font-bold text-pink-600 mb-3">
                                {loveLanguageResult}
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg mb-4">
                            <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                {(() => {
                                    const description = loveLanguageDescriptions[loveLanguageResult as keyof typeof loveLanguageDescriptions];
                                    return description ? description[language as keyof typeof description] || description.en : '';
                                })()}
                            </p>

                            {/* Love Language Tips */}
                            <div className="bg-pink-25 p-3 rounded-lg border border-pink-100">
                                <h5 className="text-sm font-semibold text-pink-700 mb-2">
                                    💡 Tips for your love language:
                                </h5>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    {loveLanguageResult === 'Words' && (
                                        <>
                                            <li>• Ask for verbal appreciation and encouragement</li>
                                            <li>• Share your feelings through words regularly</li>
                                            <li>• Value written notes and messages</li>
                                        </>
                                    )}
                                    {loveLanguageResult === 'Acts' && (
                                        <>
                                            <li>• Appreciate when others help with tasks</li>
                                            <li>• Show love by doing helpful things for others</li>
                                            <li>• Notice and acknowledge acts of service</li>
                                        </>
                                    )}
                                    {loveLanguageResult === 'Time' && (
                                        <>
                                            <li>• Prioritize uninterrupted time together</li>
                                            <li>• Put away distractions during conversations</li>
                                            <li>• Plan meaningful activities together</li>
                                        </>
                                    )}
                                    {loveLanguageResult === 'Gifts' && (
                                        <>
                                            <li>• Appreciate thoughtful gestures and surprises</li>
                                            <li>• Remember special occasions and milestones</li>
                                            <li>• Value the thought behind gifts, not the cost</li>
                                        </>
                                    )}
                                    {loveLanguageResult === 'Touch' && (
                                        <>
                                            <li>• Communicate your need for physical affection</li>
                                            <li>• Appreciate hugs, hand-holding, and closeness</li>
                                            <li>• Use appropriate touch to show care</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Share Results Section */}
                        <div className="bg-pink-50 p-4 rounded-lg mb-4">
                            <h4 className="text-sm font-semibold text-pink-700 mb-3 text-center">
                                💕 Share Your Love Language
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => handleShareResults('whatsapp')}
                                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097z" />
                                    </svg>
                                    WhatsApp
                                </button>
                                <button
                                    onClick={() => handleShareResults('copy')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy Link
                                </button>
                            </div>
                            <p className="text-xs text-pink-600 mt-2 text-center">
                                Help your loved ones understand how you feel most loved! 💖
                            </p>
                            {shareMessage && (
                                <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-green-700 text-xs text-center">
                                    {shareMessage}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={handleGoToLoveDoctor}
                                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full"
                            >
                                💬 Get Personalized Love Coaching
                            </button>
                            <button
                                onClick={handleGenerateLoveNote}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full"
                            >
                                💝 Generate a Personalized Love Note
                            </button>
                            <button
                                onClick={handleBackToHome}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors w-full"
                            >
                                ← Back to Home
                            </button>
                        </div>
                    </div>
                )}

                {!user && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm font-medium">🎁 Sign up and get R5 free credits!</p>
                        <p className="text-blue-700 text-xs mt-1">
                            Create an account to save your results and access personalized features.
                        </p>
                    </div>
                )}
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialMode="signup"
            />
        </div>
    );
}