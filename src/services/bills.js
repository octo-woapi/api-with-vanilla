module.exports = models => {
  return { list, removeAll };

  async function list() {
    return models.Bill.findAll();
  }

  async function removeAll() {
    const billList = await models.Bill.findAll();
    const promises = billList.map(bill => bill.destroy());
    return Promise.all(promises);
  }
};
