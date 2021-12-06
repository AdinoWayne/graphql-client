export interface User {
    userId: string;
    nickName: string;
    phoneNumber: string;
    mobileType: string;
    langCode: string;
    userImgUrl: string;
    createdDate: string;
    modifiedDate: string;
  }
  export interface UserWearers {
    id: number;
    wearerId: number;
    userId: string;
    isDelete: string;
    userWearerType: string;
    nickName: string;
    createdDate: string;
    modifiedDate: string;
    wearer: null | string;
    user: User;
  }
  export interface Wearers {
    wearerId: number;
    name: string;
    mobile: string;
    subMobile: string;
    birth: string;
    genderType: string;
    height: number;
    weight: number;
    bloodType: string;
    address: string;
    city: string;
    description: string;
    userWearers: null | Array<UserWearers>;
  }
  export interface Device {
    deviceId: string;
    deviceUid: string;
    deviceName: string;
    status: string[];
    statusLevel: string;
    battery: number;
    initialize: boolean;
    deviceImgUrl: null | string;
    createdDate: string;
    modifiedDate: string;
    landLine: null | string;
    activated: boolean;
    steps: number;
    healthRate: number;
    sleep: number;
    wearers: null | Array<Wearers>;
    beacon: null | string;
    geofences: string[];
    deviceVersion: string | null;
    subscription: null | string;
  }
export interface Tag {
    name: string;
}

export type ActivitySeries = {
    activityId: string;
    action: string;
    device: Device | null;
    createdDate: string;
    message: string | null;
    location: any;
    user: any;
}

export interface Status {
    name: string;
    site: string;
    wearable: any;
    hub: string;
    condition: string;
    id: string;
    wearerId: string;
}

export type Location = {
    lat: number;
    lng: number;
    source: string;
    createdDate: string;
    accuracy: number;
}

export interface Event {
    name: string;
    wearerId: string;
    occurredAt: string;
    site: string;
    eventType: string;
	createdDate: string;
	modifiedDate: string;
	resolved: boolean;
	taken: boolean;
	typeLevel: string;
	device: Device;
	activityId: string;
	battery: number;
	cancel: boolean;
  user?: User;
	action: any;
    location: Location | null;
    activitySeries: ActivitySeries[]
}

export interface UserUploadExcel {
  USER_TYPE: string;
  NICK_NAME: string;
  EMAIL: string;
  PHONE_NUMBER: string;
}

export interface UserUpload {
  userType: string;
  nickName: string;
  email: string;
  phoneNumber: string;
}