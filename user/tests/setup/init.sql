CREATE TYPE game_platform AS ENUM ('steam', 'epic');

CREATE TABLE users (
    -- Basic Info
    id              int             NOT NULL,
    platform        game_platform   NOT NULL,
    username        text            NOT NULL,
    date_created    text,

    -- Stats
    number_of_replays int,
    wins int,
    losses int,
    total_goals int,
    total_assists int,
    total_saves int,
    total_shots int,

    PRIMARY KEY(id)
);

insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (1, 'epic', 'pbaford0', '2022-11-02', 73, 956, 757, 7413, 5039, 1646, 9370);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (2, 'epic', 'ghalsworth1', '2022-11-24', 60, 619, 829, 4214, 3492, 8331, 7254);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (3, 'steam', 'ytuer2', '2022-08-31', 75, 374, 866, 4842, 2026, 1842, 1990);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (4, 'epic', 'lhovee3', '2022-12-27', 15, 406, 789, 453, 3063, 8295, 1125);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (5, 'epic', 'egavrieli4', '2022-11-01', 90, 356, 803, 5650, 122, 5848, 1151);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (6, 'steam', 'ztuther5', '2023-01-09', 81, 341, 744, 40, 8930, 7564, 4489);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (7, 'steam', 'gemson6', '2022-07-14', 28, 796, 548, 5247, 5877, 1616, 3189);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (8, 'epic', 'dfooter7', '2022-07-24', 18, 163, 762, 5534, 204, 5864, 6562);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (9, 'epic', 'jmcdougall8', '2022-04-06', 95, 216, 736, 8361, 5353, 2388, 6984);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (10, 'epic', 'hemsley9', '2022-10-27', 83, 212, 255, 4285, 6453, 2338, 9224);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (11, 'steam', 'ebuttgowa', '2022-06-17', 88, 137, 158, 2909, 8210, 6414, 8080);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (12, 'epic', 'ebreab', '2022-09-30', 93, 882, 949, 7167, 9732, 8354, 7555);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (13, 'epic', 'spullenc', '2022-05-30', 72, 795, 433, 3913, 4782, 8488, 3918);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (14, 'epic', 'cdangerfieldd', '2022-10-06', 11, 24, 567, 1082, 2509, 6307, 1346);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (15, 'steam', 'btippette', '2022-03-25', 1, 110, 20, 6699, 4732, 9357, 7128);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (16, 'steam', 'wkinderf', '2022-08-11', 77, 254, 829, 6481, 2590, 3065, 6843);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (17, 'epic', 'cgirogettig', '2022-06-22', 70, 944, 732, 4567, 7108, 7901, 2851);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (18, 'steam', 'npurdeyh', '2022-07-04', 94, 777, 446, 882, 2847, 9748, 7419);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (19, 'epic', 'tvizardi', '2022-03-27', 34, 716, 622, 5863, 6960, 1578, 7899);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (20, 'epic', 'kcaddanj', '2022-04-26', 95, 495, 158, 521, 3392, 40, 4265);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (21, 'steam', 'mchillk', '2022-05-22', 73, 478, 130, 5667, 8737, 5556, 2727);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (22, 'epic', 'meldrettl', '2022-10-20', 32, 821, 729, 2414, 7474, 8168, 9366);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (23, 'epic', 'ncrapperm', '2022-06-12', 36, 195, 992, 3496, 228, 4454, 429);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (24, 'steam', 'ccarderon', '2022-03-31', 69, 899, 849, 8224, 9995, 7993, 811);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (25, 'steam', 'cdjordjevico', '2022-11-19', 85, 171, 991, 7270, 1242, 2201, 1985);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (26, 'epic', 'jsergeanp', '2022-12-26', 24, 593, 711, 5799, 573, 9192, 4843);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (27, 'steam', 'tcherrieq', '2022-09-28', 34, 191, 359, 5925, 5634, 6131, 2259);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (28, 'epic', 'tbernardetr', '2022-11-04', 73, 363, 165, 3759, 4694, 2227, 2161);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (29, 'epic', 'tfortmans', '2022-09-27', 62, 862, 405, 674, 9429, 9458, 2158);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (30, 'steam', 'jmechellt', '2022-05-15', 89, 768, 456, 4785, 9689, 9330, 5019);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (31, 'steam', 'tgaineu', '2022-06-12', 56, 715, 358, 1074, 6567, 8448, 7439);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (32, 'epic', 'ptosdevinv', '2023-01-24', 69, 911, 506, 9924, 431, 3162, 7073);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (33, 'steam', 'ohawlerw', '2022-09-02', 48, 97, 144, 9884, 6487, 3759, 8647);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (34, 'epic', 'ethewysx', '2022-10-09', 13, 430, 86, 180, 6706, 6707, 6185);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (35, 'steam', 'vgrogory', '2022-09-15', 38, 867, 542, 9746, 9809, 6309, 839);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (36, 'steam', 'mmartensenz', '2022-09-05', 10, 785, 438, 9820, 2105, 7598, 4772);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (37, 'steam', 'mmilthorpe10', '2023-02-17', 99, 87, 528, 6871, 6359, 7659, 7631);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (38, 'epic', 'pdanzey11', '2022-03-17', 55, 759, 304, 1558, 4486, 8478, 4223);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (39, 'steam', 'ibertwistle12', '2022-10-17', 2, 158, 188, 736, 2289, 6198, 9175);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (40, 'epic', 'bwippermann13', '2023-02-01', 76, 721, 166, 2202, 7968, 7241, 2470);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (41, 'steam', 'bantoniou14', '2022-12-14', 25, 957, 743, 8639, 8569, 270, 1185);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (42, 'steam', 'llockier15', '2022-03-06', 70, 966, 825, 7393, 1206, 4333, 3290);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (43, 'steam', 'apetrushka16', '2022-06-25', 65, 414, 158, 5805, 214, 9015, 2356);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (44, 'epic', 'mphillpot17', '2022-04-24', 87, 455, 704, 3039, 3803, 3580, 4722);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (45, 'epic', 'dbelward18', '2022-09-26', 74, 140, 899, 3040, 7504, 8488, 4110);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (46, 'steam', 'lbulfoy19', '2022-08-29', 40, 813, 450, 926, 7195, 3268, 8579);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (47, 'epic', 'mbemment1a', '2023-01-21', 57, 837, 482, 1645, 2147, 6553, 8144);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (48, 'steam', 'otabbernor1b', '2022-09-28', 28, 6, 700, 6905, 1417, 3291, 7910);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (49, 'epic', 'ldoorbar1c', '2022-06-09', 56, 103, 54, 6121, 1306, 9101, 1981);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (50, 'steam', 'atirrey1d', '2022-09-22', 77, 128, 518, 2123, 9860, 6620, 4165);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (51, 'epic', 'cjohnsey1e', '2023-02-24', 4, 373, 20, 5872, 609, 763, 9400);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (52, 'epic', 'xebbitt1f', '2022-08-30', 15, 710, 115, 7058, 8845, 1329, 4304);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (53, 'steam', 'ahryniewicz1g', '2022-05-26', 4, 651, 289, 3018, 2833, 9164, 1385);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (54, 'steam', 'hashlee1h', '2022-11-02', 26, 621, 796, 9045, 5687, 746, 3256);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (55, 'epic', 'bcosyns1i', '2022-04-25', 64, 223, 181, 435, 3234, 9532, 8589);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (56, 'epic', 'halldis1j', '2022-08-20', 9, 443, 730, 4128, 5505, 1918, 7690);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (57, 'epic', 'arosson1k', '2022-12-20', 92, 653, 22, 3696, 489, 5674, 7204);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (58, 'epic', 'jlowey1l', '2022-11-06', 17, 786, 825, 6405, 5515, 6723, 2505);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (59, 'steam', 'sahrens1m', '2022-09-27', 5, 281, 947, 4684, 1399, 2896, 4439);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (60, 'epic', 'moldmeadow1n', '2022-11-12', 61, 136, 416, 1654, 6905, 7074, 7221);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (61, 'epic', 'msand1o', '2023-01-19', 57, 457, 328, 499, 5447, 7759, 4321);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (62, 'epic', 'hscotford1p', '2023-02-09', 25, 218, 981, 8180, 1407, 1775, 6206);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (63, 'steam', 'bmcphilip1q', '2022-03-24', 46, 593, 546, 9275, 7902, 5679, 1987);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (64, 'epic', 'fmckeurtan1r', '2022-09-20', 25, 217, 73, 3222, 406, 145, 5662);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (65, 'epic', 'hyesson1s', '2023-02-24', 22, 22, 981, 6487, 7691, 5257, 3547);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (66, 'epic', 'lgallienne1t', '2022-04-27', 46, 416, 769, 9251, 7009, 1089, 1908);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (67, 'epic', 'cferrettini1u', '2022-05-29', 87, 716, 589, 2178, 5085, 9031, 7869);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (68, 'epic', 'dcicchinelli1v', '2022-03-18', 34, 655, 795, 8530, 8396, 9184, 4328);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (69, 'steam', 'esiviour1w', '2022-10-01', 42, 541, 818, 2698, 6772, 9738, 9696);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (70, 'steam', 'ttottie1x', '2023-02-04', 14, 275, 119, 814, 4349, 7781, 4086);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (71, 'epic', 'jedgeson1y', '2022-04-08', 52, 454, 706, 871, 5917, 2674, 2870);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (72, 'steam', 'mmcturk1z', '2023-01-28', 57, 696, 667, 371, 735, 9257, 5259);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (73, 'epic', 'gnuzzetti20', '2022-07-19', 6, 446, 907, 2218, 4446, 1252, 675);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (74, 'steam', 'bgalletly21', '2022-10-01', 37, 418, 403, 9394, 2403, 4453, 2317);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (75, 'epic', 'lbenson22', '2022-12-26', 47, 505, 151, 828, 8834, 2279, 5154);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (76, 'epic', 'glawes23', '2022-05-21', 46, 222, 986, 9630, 1019, 3807, 3172);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (77, 'epic', 'tluchelli24', '2022-11-27', 70, 684, 272, 6216, 6413, 7069, 798);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (78, 'steam', 'wblacket25', '2022-12-20', 27, 370, 944, 1808, 1256, 3260, 4600);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (79, 'epic', 'dlaughlin26', '2022-12-26', 23, 0, 755, 1226, 800, 3558, 2577);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (80, 'steam', 'lturrill27', '2022-11-25', 84, 742, 166, 9827, 2089, 5191, 9396);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (81, 'steam', 'fstrongman28', '2022-07-12', 67, 512, 872, 6702, 441, 1855, 6983);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (82, 'epic', 'ggutierrez29', '2022-07-08', 43, 235, 638, 6453, 2300, 306, 5822);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (83, 'steam', 'glukes2a', '2022-11-11', 66, 163, 282, 9635, 2389, 2113, 6397);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (84, 'steam', 'cflear2b', '2022-04-19', 71, 886, 872, 5638, 3952, 7084, 9680);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (85, 'epic', 'hhannaby2c', '2022-12-04', 53, 291, 477, 9852, 4122, 7825, 5039);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (86, 'epic', 'beberst2d', '2022-04-28', 94, 555, 636, 9193, 8644, 2498, 4206);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (87, 'epic', 'cguppie2e', '2022-10-31', 29, 398, 319, 1356, 3905, 1682, 8124);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (88, 'epic', 'jdabel2f', '2023-01-03', 50, 397, 160, 8996, 3675, 7796, 4039);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (89, 'steam', 'bperigoe2g', '2022-08-15', 37, 489, 631, 3242, 153, 7357, 4048);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (90, 'steam', 'bnolot2h', '2022-12-21', 1, 761, 144, 7990, 6214, 9414, 4463);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (91, 'steam', 'jdavydkov2i', '2022-12-04', 72, 103, 791, 2840, 9165, 1685, 3474);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (92, 'steam', 'llarosa2j', '2022-03-21', 86, 387, 47, 6602, 2294, 4852, 194);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (93, 'steam', 'hmatyasik2k', '2022-12-02', 35, 549, 146, 6490, 4500, 9829, 2693);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (94, 'epic', 'fhatcliffe2l', '2022-05-29', 39, 375, 636, 88, 9467, 3895, 2056);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (95, 'epic', 'dpugh2m', '2022-04-16', 30, 401, 504, 5075, 5162, 672, 4267);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (96, 'steam', 'kdanilenko2n', '2022-11-21', 55, 518, 937, 3668, 7445, 3249, 8613);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (97, 'epic', 'lhundell2o', '2023-02-08', 84, 120, 398, 5072, 9204, 9845, 8147);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (98, 'steam', 'idinisco2p', '2022-05-01', 52, 637, 894, 1975, 2425, 3905, 3709);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (99, 'steam', 'wblaza2q', '2022-05-26', 7, 674, 226, 2294, 3446, 8960, 7466);
insert into users (id, platform, username, date_created, number_of_replays, wins, losses, total_goals, total_assists, total_saves, total_shots) values (100, 'steam', 'cganing2r', '2022-03-01', 5, 649, 784, 191, 9551, 2026, 9810);