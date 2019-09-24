const app = require('./app');

app.get('/', (req, res) => {
    res.render('index', { user: req.user });
  });
  
  // '/account' is only available to logged in user
  app.get('/account', ensureAuthenticated, (req, res) => {
    res.render('account', { user: req.user });
  });
  
  app.get('/login', function(req, res, next) {
      passport.authenticate('azuread-openidconnect', 
        { 
          response: res,                      // required
          resourceURL: config.resourceURL,    // optional. Provide a value if you want to specify the resource.
          customState: 'my_state',            // optional. Provide a value if you want to provide custom state value.
          failureRedirect: '/' 
        }
      )(req, res, next);
    },
    function(req, res) {
      log.info('Login was called in the Sample');
      res.redirect('/');
  });
  
  // 'GET returnURL'
  // `passport.authenticate` will try to authenticate the content returned in
  // query (such as authorization code). If authentication fails, user will be
  // redirected to '/' (home page); otherwise, it passes to the next middleware.
  app.get('/auth/openid/return', (req, res, next) => {
      passport.authenticate('azuread-openidconnect', 
        { 
          response: res,                      // required
          failureRedirect: '/'  
        }
      )(req, res, next);
    },
    function(req, res) {
      log.info('We received a return from AzureAD.');
      res.redirect('/');
    });
  
  // 'POST returnURL'
  // `passport.authenticate` will try to authenticate the content returned in
  // body (such as authorization code). If authentication fails, user will be
  // redirected to '/' (home page); otherwise, it passes to the next middleware.
  app.post('/auth/openid/return', (req, res, next)  =>{
      passport.authenticate('azuread-openidconnect', 
        { 
          response: res,                      // required
          failureRedirect: '/'  
        }
      )(req, res, next);
    },
    function(req, res) {
      console.log(res.header);
      log.info('We received a return from AzureAD.');
      res.redirect('/');
    });
  
  // 'logout' route, logout from passport, and destroy the session with AAD.
  app.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
      req.logOut();
      res.redirect(config.destroySessionUrl);
    });
  });

  app.listen(3000);