import { IUser } from "../types/types";

export const transformRandomUser = (user: any): IUser => {
    return {
      _id: user.id ? `${user.id.name}${user.id.value}`: user.email,
      name: {
        title: user.name.title,
        first: user.name.first,
        last: user.name.last,
      },
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      picture: {
        thumbnail: user.picture.thumbnail,
        large: user.picture.large,
      },
      location: {
        country: user.location.country,
        city: user.location.city,
        state: user.location.state,
      },
      dob: {
        date: user.dob.date,
        age: user.dob.age,
      },
    };
  };