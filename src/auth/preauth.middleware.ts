import { Injectable, NestMiddleware } from "@nestjs/common";
import * as firebase from 'firebase-admin';
import { Request, Response } from 'express';
import * as  ServiceAccount  from "./cura-app-79f2f-firebase-adminsdk-61eum-33e596a581.json";
const firebase_params = {
    type: ServiceAccount.type,
    projectId: ServiceAccount.project_id,
    privateKeyId: ServiceAccount.private_key_id,
    privateKey: ServiceAccount.private_key,
    clientEmail: ServiceAccount.client_email,
    clientId: ServiceAccount.client_id,
    authUri: ServiceAccount.auth_uri,
    tokenUri: ServiceAccount.token_uri,
    authProviderX509CertUrl: ServiceAccount.auth_provider_x509_cert_url,
    clientX509CertUrl: ServiceAccount.client_x509_cert_url
}

@Injectable()
export class PreauthMiddleware implements NestMiddleware {

    private defaultApp: any;

    constructor() {
        this.defaultApp = firebase.initializeApp({
            credential: firebase.credential.cert(firebase_params),
            
        });
    }

    use(req: Request, res: Response, next: Function) {
        const token = req.headers.authorization;
        console.log(token);

        // const token1 = "eyJhbGciOiZCI6IjFlOTczZWUwZTE2ZjdlZWY0ZjkyMWQ1MGRjNjFkNzBiMmVmZWZjMkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY3VyYS1hcHAtNzlmMmYiLCJhdWQiOiJjdXJhLWFwcC03OWYyZiIsImF1dGhfdGltZSI6MTY3NzE4MTM1NCwidXNlcl9pZCI6IjhYYjZnMlZXc0FYdGhWUTJHRHN6YXB6N002MjIiLCJzdWIiOiI4WGI2ZzJWV3NBWHRoVlEyR0RzemFwejdNNjIyIiwiaWF0IjoxNjc5NTUzNTAwLCJleHAiOjE2Nzk1NTcxMDAsInBob25lX251bWJlciI6Iis5MTgwNTkyMzczMjEiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIis5MTgwNTkyMzczMjEiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwaG9uZSJ9fQ.myhliUnk4oGAGcvL24oi-4ADJMYcw6-uijgKwR7wLlQa8bHihMNz51DJNpRU1GpNnAWutdpiBBP7fsE3RbxJWt8S8U0stwp2TOshDAbEarrWEXXowutIwK8a_OR-nSR_TDfIU9PwHTymnPccQnJKUTdj5y6kCOe51gl40V2Uwy7lxOadZ29SyqjOVosde_FMzXLrF1gzJFAeEohMFjsN20rvONyNZeEhBQIqXIfwUcGyziWzld8SCROSGd4WJuyk6adDXWo7kdMepU63Av7F7ut9qrR4KRS4r8Lby-8P3cHyY1YlqkCZ-7XUhtM8mY626hs5ITT3WaUJMD96PUlInw"
        // const token1 =  token.slice(7)
        //const token1 = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOTczZWUwZTE2ZjdlZWY0ZjkyMWQ1MGRjNjFkNzBiMmVmZWZjMTkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY3VyYS1hcHAtNzlmMmYiLCJhdWQiOiJjdXJhLWFwcC03OWYyZiIsImF1dGhfdGltZSI6MTY3NzE4MTM1NCwidXNlcl9pZCI6IjhYYjZnMlZXc0FYdGhWUTJHRHN6YXB6N002MjIiLCJzdWIiOiI4WGI2ZzJWV3NBWHRoVlEyR0RzemFwejdNNjIyIiwiaWF0IjoxNjc5NTYzMzM0LCJleHAiOjE2Nzk1NjY5MzQsInBob25lX251bWJlciI6Iis5MTgwNTkyMzczMjEiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIis5MTgwNTkyMzczMjEiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwaG9uZSJ9fQ.ujni_i6LR3N85sQi7g1QRDjjtPhz6Cb57XP2-rrt1S9_VUbDUaQyTMvzoQp3k415C43DMLdtRMKtvaiDRV5fgnr8paLZL5wKFZcedbuKHK0amR22zfWx4rxgnXj2p5igfV3S8gSDxgGPiKxupmF9BILKDffPiMfuN2TkesUqpfaWAk6VZ8v5pJKA6Ok3jBW9f0Xh2IV-wft3OByCSCpkxENGqSY-I1vE7vfLBesjHihAXEjWmH6HAZwOoR0oiJTcPSivAKdCX0Fd26FBiOWZXffj7Ufl4Xx1OPXWLMKzWADzhyqMFU9ETw4nvJsUT63c6gOzW5cYagJpvGjKXsVxyg"
        
        // console.log(token1)
        if (token != null && token != '' ) {
            // const replace = token.replace('Bearer', '')
            // console.log(replace)
            this.defaultApp.auth().verifyIdToken(token.slice(7))
                .then(async decodedToken => {
                    const user = {
                        uid: decodedToken.uid,
                        phone: decodedToken.phone_number
                    }
                    console.log(user)
                    req['user'] = user;
                    next();
                }).catch(error => {
                    console.error(error);
                    this.accessDenied(req.url, res);
                });
        } else {
            next();
        }
    }

    private accessDenied(url: string, res: Response) {
        res.status(403).json({
            statusCode: 403,
            timestamp: new Date().toISOString(),
            path: url,
            message: 'Access Denied'
        });
    }
}
