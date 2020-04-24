// import { Strategy, Profile } from 'passport-facebook';
// import { AuthGuard } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { UserService } from 'user/user.service';
// import { use } from 'passport';

// @Injectable()
// export class LocalStrategy {
//   constructor(readonly userService: UserService) {
//     use(
//       'facebook',
//       new Strategy(
//         {
//           clientID: '933128667136642',
//           clientSecret: 'b5f645ac5bc377fdd9d90c630e797984',
//           callbackURL: '/home',
//         },
//         this.verify,
//       ),
//     );
//   }

//   verify = (
//     accessToken: string,
//     refreshToken: string,
//     profile: Profile,
//     done: (error: any, user?: any, info?: any) => void,
//   ) => {
//       debugger;
//   };
// }

// @Injectable()
// export class LocalAuthGuard extends AuthGuard('local') {}
