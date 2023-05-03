# Restaurant App


Capstone project for final bootcamp section. This is a full stack mock e-commerce project built with Next.js and TypeScript. Features / technologies include:

- Browse as a guest or create an account to submit an order
- Authentication using JSON Web Tokens
- Users can also log in via Google OAuth 2.0 ("Sign in with Google")
- Authentication tokens handled through companion Auth-Server REST API project found [here](https://github.com/nitnub/auth-server) 
- Shopping cart caching with Redis. Users can store items in a cart before signing in. Guest cart items will transfer into the user's existing cart upon sign-in
- Restaurant data stored in PostgreSQL and accessed via GraphQL w/Apollo & Prisma
- Styling via [Material UI](https://mui.com/)
- [Stripe](https://stripe.com/) integration for payment processing 
  

## Installation and Usage 
This project has been dockerized and is currently deployed to an AWS EC2 instance accessible at [https://restaurants.nickbryant.dev/](https://restaurants.nickbryant.dev/)


## Future Enhancements Roadmap
- Improved responsiveness


## Resources and Attributions
- Add and subtract circle icons sourced from http://www.w3.org/2000/svg
- Leaf and GF icon sourced from https://www.svgrepo.com/


## License Information (MIT)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

