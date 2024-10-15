/**
 * 本地
 * 192.168.2.186
 * 远程
 * 172.16.20.144
 * @type {string}
 */
export const DestIP = "192.168.2.186";

export const DestPort = "80";
export const DestIp_Port = "192.168.2.186_80";

// 协议号，http协议，1表示http协议 2表示https协议
export const LOGIN_PROTO = 1;
// rtsp端口号，默认是554
export const RTSP_PORT = 554;

export const USERNAME = "admin";
/**
 * 本地
 * cumtb617
 * 远程
 * Wxb108@130
 * @type {string}
 */
export const PASSWORD = "cumtb617";

/**
 * 本地
 * "Camera 01": 0,
 * 远程
 * others
 * @type {{"Camera 01": number}}
 */
export const Name_Channel = {
  // 本地测试使用
  "Camera 01": 0,

  // 130
  // name-channel
  MC_Door_130_10_outer: 1,
  MC_Door_130_10_inner: 2,
  MC_Door_130_9_outer: 3,
  MC_Door_130_9_inner: 4,
  MC_Door_130_8_outer: 5,
  MC_Door_130_8_inner: 6,
  MC_Door_130_7_outer: 7,
  MC_Door_130_7_inner: 8,
  MC_Door_130_6_outer: 9,
  MC_Door_130_6_inner: 10,
  MC_Door_130_5_outer: 11,
  MC_Door_130_5_inner: 12,
  MC_Door_130_4_outer: 13,
  MC_Door_130_4_inner: 14,
  MC_Door_130_3_outer: 15,
  MC_Door_130_3_inner: 16,
  MC_Door_130_2_outer: 17,
  MC_Door_130_2_inner: 18,

  // 108
  // name-channel
  MC_Door_108_8_outer: 1,
  MC_Door_108_8_inner: 2,
  MC_Door_108_7_outer: 3,
  MC_Door_108_7_inner: 4,
  MC_Door_108_6_outer: 5,
  MC_Door_108_6_inner: 6,
  MC_Door_108_5_outer: 7,
  MC_Door_108_5_inner: 8,
  MC_Door_108_4_outer: 9,
  MC_Door_108_4_inner: 10,
  MC_Door_108_3_outer: 11,
  MC_Door_108_3_inner: 12,
  MC_Door_108_2_outer: 13,
  MC_Door_108_2_inner: 14,
  MC_Door_108_1_outer: 15,
  MC_Door_108_1_inner: 16,
};

export const CJ108 = "172.16.20.145";
export const CJ130 = "172.16.20.144";
export const EV = "172.16.18.2";

export const CJ_Password = "Wxb108@130";
export const EV_Password = "hik12345+";

// 不加判断了，使用ip直接连
// port 80
// rtsp port 554
export const Name_Ip_Dict = {
  MC_Door_108_8_outer: {
    ip: "172.16.20.113",
    username: "admin",
    password: "Wxb108@130",
  },
  MC_Door_108_8_inner: {
    ip: "172.16.20.114",
    username: "admin",
    password: "Wxb108@131",
  },
  MC_Door_108_7_outer: {
    ip: "172.16.20.115",
    username: "admin",
    password: "Wxb108@132",
  },
  MC_Door_108_7_inner: {
    ip: "172.16.20.116",
    username: "admin",
    password: "Wxb108@133",
  },
  MC_Door_108_6_outer: {
    ip: "172.16.20.117",
    username: "admin",
    password: "Wxb108@134",
  },
  MC_Door_108_6_inner: {
    ip: "172.16.20.118",
    username: "admin",
    password: "Wxb108@135",
  },
  MC_Door_108_5_outer: {
    ip: "172.16.20.119",
    username: "admin",
    password: "Wxb108@136",
  },
  MC_Door_108_5_inner: {
    ip: "172.16.20.120",
    username: "admin",
    password: "Wxb108@137",
  },
  MC_Door_108_4_outer: {
    ip: "172.16.20.121",
    username: "admin",
    password: "Wxb108@138",
  },
  MC_Door_108_4_inner: {
    ip: "172.16.20.122",
    username: "admin",
    password: "Wxb108@139",
  },
  MC_Door_108_3_outer: {
    ip: "172.16.20.123",
    username: "admin",
    password: "Wxb108@140",
  },
  MC_Door_108_3_inner: {
    ip: "172.16.20.124",
    username: "admin",
    password: "Wxb108@141",
  },
  MC_Door_108_2_outer: {
    ip: "172.16.20.125",
    username: "admin",
    password: "Wxb108@142",
  },
  MC_Door_108_2_inner: {
    ip: "172.16.20.126",
    username: "admin",
    password: "Wxb108@143",
  },
  MC_Door_108_1_outer: {
    ip: "172.16.20.127",
    username: "admin",
    password: "Wxb108@144",
  },
  MC_Door_108_1_inner: {
    ip: "172.16.20.128",
    username: "admin",
    password: "Wxb108@145",
  },
  MC_Door_130_10_outer: {
    ip: "172.16.19.113",
    username: "admin",
    password: "Wxb108@146",
  },
  MC_Door_130_10_inner: {
    ip: "172.16.19.114",
    username: "admin",
    password: "Wxb108@147",
  },
  MC_Door_130_9_outer: {
    ip: "172.16.19.115",
    username: "admin",
    password: "Wxb108@148",
  },
  MC_Door_130_9_inner: {
    ip: "172.16.19.116",
    username: "admin",
    password: "Wxb108@149",
  },
  MC_Door_130_8_outer: {
    ip: "172.16.19.117",
    username: "admin",
    password: "Wxb108@150",
  },
  MC_Door_130_8_inner: {
    ip: "172.16.19.118",
    username: "admin",
    password: "Wxb108@151",
  },
  MC_Door_130_7_outer: {
    ip: "172.16.19.119",
    username: "admin",
    password: "Wxb108@152",
  },
  MC_Door_130_7_inner: {
    ip: "172.16.19.120",
    username: "admin",
    password: "Wxb108@153",
  },
  MC_Door_130_6_outer: {
    ip: "172.16.19.121",
    username: "admin",
    password: "Wxb108@154",
  },
  MC_Door_130_6_inner: {
    ip: "172.16.19.122",
    username: "admin",
    password: "Wxb108@155",
  },
  MC_Door_130_5_outer: {
    ip: "172.16.19.123",
    username: "admin",
    password: "Wxb108@156",
  },
  MC_Door_130_5_inner: {
    ip: "172.16.19.124",
    username: "admin",
    password: "Wxb108@157",
  },
  MC_Door_130_4_outer: {
    ip: "172.16.19.125",
    username: "admin",
    password: "Wxb108@158",
  },
  MC_Door_130_4_inner: {
    ip: "172.16.19.126",
    username: "admin",
    password: "Wxb108@159",
  },
  MC_Door_130_3_outer: {
    ip: "172.16.19.127",
    username: "admin",
    password: "Wxb108@160",
  },
  MC_Door_130_3_inner: {
    ip: "172.16.19.128",
    username: "admin",
    password: "Wxb108@161",
  },
  MC_Door_130_2_outer: {
    ip: "172.16.19.129",
    username: "admin",
    password: "Wxb108@162",
  },
  MC_Door_130_2_inner: {
    ip: "172.16.19.130",
    username: "admin",
    password: "Wxb108@163",
  },
  EV_Door_10_outer: {
    ip: "172.16.18.113",
    username: "admin",
    password: "hik12345+",
  },
  EV_Door_10_inner: {
    ip: "172.16.18.114",
    username: "admin",
    password: "hik12346+",
  },
  EV_Door_9_outer: {
    ip: "172.16.18.115",
    username: "admin",
    password: "hik12347+",
  },
  EV_Door_9_inner: {
    ip: "172.16.18.116",
    username: "admin",
    password: "hik12348+",
  },
  EV_Door_8_outer: {
    ip: "172.16.18.117",
    username: "admin",
    password: "hik12349+",
  },
  EV_Door_8_inner: {
    ip: "172.16.18.118",
    username: "admin",
    password: "hik12350+",
  },
  EV_Door_7_outer: {
    ip: "172.16.18.119",
    username: "admin",
    password: "hik12351+",
  },
  EV_Door_7_inner: {
    ip: "172.16.18.120",
    username: "admin",
    password: "hik12352+",
  },
  EV_Door_6_outer: {
    ip: "172.16.18.121",
    username: "admin",
    password: "hik12353+",
  },
  EV_Door_6_inner: {
    ip: "172.16.18.122",
    username: "admin",
    password: "hik12354+",
  },
  EV_Door_5_outer: {
    ip: "172.16.18.123",
    username: "admin",
    password: "hik12355+",
  },
  EV_Door_5_inner: {
    ip: "172.16.18.124",
    username: "admin",
    password: "hik12356+",
  },
  EV_Door_4_outer: {
    ip: "172.16.18.125",
    username: "admin",
    password: "hik12357+",
  },
  EV_Door_4_inner: {
    ip: "172.16.18.126",
    username: "admin",
    password: "hik12358+",
  },
  EV_Door_3_outer: {
    ip: "172.16.18.127",
    username: "admin",
    password: "hik12359+",
  },
  EV_Door_3_inner: {
    ip: "172.16.18.128",
    username: "admin",
    password: "hik12360+",
  },
};
