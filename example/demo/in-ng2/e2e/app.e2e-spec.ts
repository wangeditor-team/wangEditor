import { Ng2CliPage } from './app.po';

describe('ng2-cli App', function() {
  let page: Ng2CliPage;

  beforeEach(() => {
    page = new Ng2CliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
