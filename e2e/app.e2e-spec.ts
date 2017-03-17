import { ErpPage } from './app.po';

describe('erp App', function() {
  let page: ErpPage;

  beforeEach(() => {
    page = new ErpPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
