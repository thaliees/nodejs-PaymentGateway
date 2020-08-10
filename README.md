# Payment Gateway
This project was created to make transactions with PayPal (Server-side).     
Client-side, **only** accesses the account from which the payment will be taken, Server-side will make the transaction. To see the mobile implementation [click here](https://github.com/thaliees/ios-PaymentGateway_PayPal)

## Documentation
* [Braintree - Guide](https://developers.braintreepayments.com/guides/overview)
* [PayPal - Sandbox Merchant](https://www.sandbox.paypal.com/mx/webapps/mpp/merchant). Here you can see the transactions made.

## Prerequisites
1. Register PayPal Account. [Register you here](https://www.paypal.com/mx/webapps/mpp/account-selection)
1. PayPal Developer Sandbox Account. [Log in you here](https://developer.paypal.com/classic-home/) with your credentials of PayPal Account
1. Register Braintree Sandbox Account. [Register you here](https://www.braintreepayments.com/sandbox). Read **[Getting Started](#getting-started)**: Step 2.i.

## Getting Started
1. PayPal Developer Sandbox Account: [Link](https://developer.paypal.com/developer/accounts/)     
    1. Credentials     
        Log in in to your PayPal Developer Sandbox Account. In left panel, select the option, **Accounts**. In the section **Sandbox Accounts**, you be able to see two accounts by *default*.     
        Now, click on the three dots options button of the *Business Account*, and select **View/Edit Account**. Copy the Email ID and System Generated Password.
    2. My Apps and Credentials     
        In the same panel, select the option **My Apps & Credentials**. In the section, **REST API apps**, you can create a new app or use *Default Application*.     
        Now, click on *Default Applications* (or your new app), and copy values Sandbox account, Client ID, and Secret (click on *Show button to show secret key*).
2. Braintree Sandox Account: [Link](https://www.braintreepayments.com/sandbox)     
    1. Braintree Sandbox Account     
        When you click on **Log in**, is possible you see a pop modal. Click on Log in that is in the bottom (Looking for Sandbox? Log in or sign up).     
        To log in, you can also do it with PayPal credentials; these credentials are the ones copied in the step 1.i. If you want to create an account different, do it.
    2. Enable PayPal     
        Now, click on the *Gear* icon in the top right corner, then click on *Processing*. In the section, **Payment Methods**, in the option *PayPal*, click on *Link Sandbox* (below the switch button).     
        Paste the values copied in the step 1.ii, then Check checkbox *Manage PayPal Disputes in the Braintree Control Panel*. To finish, click on *Link PayPal Sandbox*.
    3. Keys     
        In the panel that is in the top, click on *API*. In the section **API Keys**, copied *Public Key* and *Private Key* (click ok View). On the same page, scroll down to the section **Client-Side Encryption Key** and copied *Merchant ID*.
3. Testing and Go Live     
    Read [this section](https://developers.braintreepayments.com/guides/paypal/testing-go-live/node#go-live) and the following ones below

### Installing
1. Clone this repo (with SSH)
```
% git clone git@github.com:thaliees/nodejs-PaymentGateway.git
```
2. Enter in the directory
3. Install dependencies
```
% npm install
```
4. Create .env file     
In a new file, you should write the following variables and their values
```bash
NODE_ENV=DEVELOPMENT
PORT=3000
HOST=http://localhost:3000
MERCHANT_ID=paste Merchant ID (Getting Started 2.iii)
PUBLIC_KEY=paste Public Key (Getting Started 2.iii)
PRIVATE_KEY=paste Private Key (Getting Started 2.iii)
```
5. Run project
```
% npm start
```
If everything went well, you should be able to see on the console
```bash
> paymentgateway@1.0.0 start your_path_directory
> nodemon index.js

[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
Run in: http://localhost:3000
```

### Running the tests
Local: <http://localhost:3000/api/api-docs>     
Heroku: <https://paymentgateway-braintree.herokuapp.com/api/api-docs>

### Deployment
This project is deployed on Heroku
1. Install the Heroku CLI
```
% brew tap heroku/brew && brew install heroku
```
2. Login
```
% heroku login
```
3. Add remote
```
% heroku git:remote -a name_your_api_on_heroku
```
4. Deploy this project
```
% git push heroku master
```

### Built With
* [Node.js](https://nodejs.org/en/) - Open source server environment (V13.8)
* [Express](https://expressjs.com/) - Node.js web application infrastructure (V4.17.1)
* [npm](https://www.npmjs.com) - Dependency Management

### Versioning
We use [SemVer](https://semver.org/) for versioning.     
Current version 1.0.0

## License
This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.