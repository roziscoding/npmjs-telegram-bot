/* global describe, it, before */
const { expect } = require('chai')
const crawler = require('../app/lib/crawler')

describe('Crawler', () => {
  describe('Search', () => {
    let results

    before(async () => {
      results = await crawler.search('cross spawn')
    })

    it('Results should be an Array', () => {
      expect(results).to.be.an('array')
    })

    it('Results should contain package name', () => {
      expect(results[0]).to.have.a.property('name')
    })

    it('Results should contain package description', () => {
      expect(results[0]).to.have.a.property('description')
    })

    it('Results should contain package version', () => {
      expect(results[0]).to.have.a.property('version')
    })

    it('Results should contain package link', () => {
      expect(results[0]).to.have.a.property('link')
    })
  })

  describe('Most Starred', () => {
    let results

    before(async function () {
      results = await crawler.recommend()
    })

    it('Results should be an Array', () => {
      expect(results).to.be.an('array')
    })

    it('Results should contain package name', () => {
      expect(results[0]).to.have.a.property('name')
    })

    it('Results should contain package description', () => {
      expect(results[0]).to.have.a.property('description')
    })

    it('Results should contain package version', () => {
      expect(results[0]).to.have.a.property('version')
    })

    it('Results should contain package link', () => {
      expect(results[0]).to.have.a.property('link')
    })
  })
})
