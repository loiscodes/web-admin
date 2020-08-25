import { ref } from '@vue/composition-api';
import { handler, password } from '@/hooks/encryption';


export enum Secrets {
  AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID',
  AWS_REGION = 'AWS_REGION',
  AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY',
  GCP_API_KEY = 'GCP_API_KEY',
  GCP_API_SECRET = 'GCP_API_SECRET',
}


export const secrets = {
  values: {
    AWS_ACCESS_KEY_ID: ref(''),
    AWS_REGION: ref('eu-west-1'),
    AWS_SECRET_ACCESS_KEY: ref(''),
    GCP_API_KEY: ref(''),
    GCP_API_SECRET: ref(''),
  },

  entries: () => Object.entries(secrets.values),

  list: () => Object.values(secrets.values),

  serialize: () => secrets.entries().map(([key, obj]) => [key, obj.value]),

  save: async () => await handler.save({ password: password.value }, { secrets: secrets.serialize() }),

  load: async () => {
    const payload = await handler.load({ password: password.value }) as { secrets: string[][] };

    if (payload && payload.secrets) {
      payload.secrets.forEach(([key, value]) => {
        const secret = secrets.values[key as Secrets];

        if (secret) {
          secret.value = value;
        }
      });
    }
  },
};


// export class SecretManager {
//   values: {
//     [key in Secrets]: Ref<string>
//   };

//   constructor() {
//     this.values = {
//       GCP_API_KEY: ref(''),
//       GCP_API_SECRET: ref(''),
//     };
//   }

//   get entries() {
//     return Object.entries(this.values);
//   }

//   get list() {
//     return Object.values(this.values);
//   }

//   serialize() {
//     return this.entries.map(([key, obj]) => [key, obj.value]);
//   }

//   async save() {
//     const payload = { secrets: this.serialize() };
//     await handler.save({ password: password.value }, payload);
//   }

//   async load() {
//   }
// }

// export const secrets = new SecretManager();
