import { Component, inject, OnInit, signal } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { Utility } from '../../models/utility.model';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent implements OnInit {
  private utilityService = inject(UtilityService);

  activeTab = signal<'xml' | 'dtd' | 'parser'>('xml');

  rawXml = signal<string>('Loading utilities.xml...');
  rawDtd = signal<string>('Loading utilities.dtd...');
  parsedXmlNodes = signal<Utility[]>([]);
  parseStatus = signal<string | null>(null);
  isParsing = signal<boolean>(false);

  ngOnInit(): void {
    this.loadXmlAndDtd();
  }

  async loadXmlAndDtd(): Promise<void> {
    try {
      const xmlRes = await fetch('/data/utilities.xml');
      this.rawXml.set(await xmlRes.text());
    } catch (e: any) {
      this.rawXml.set(`<!-- Error loading utilities.xml: ${e.message} -->`);
    }

    try {
      const dtdText = await this.utilityService.fetchDtdRawText();
      this.rawDtd.set(dtdText);
    } catch (e: any) {
      this.rawDtd.set(`<!-- Error loading utilities.dtd: ${e.message} -->`);
    }
  }

  async testLiveDomParser(): Promise<void> {
    this.isParsing.set(true);
    this.parseStatus.set(null);
    try {
      const result = await this.utilityService.fetchUtilitiesFromXml();
      this.parsedXmlNodes.set(result.utilities);
      this.parseStatus.set(`Success: DOMParser successfully extracted ${result.utilities.length} <utility> records from utilities.xml validated against utilities.dtd!`);
    } catch (err: any) {
      this.parseStatus.set('Error parsing XML: ' + err.message);
    } finally {
      this.isParsing.set(false);
    }
  }

  setTab(tab: 'xml' | 'dtd' | 'parser'): void {
    this.activeTab.set(tab);
    if (tab === 'parser' && this.parsedXmlNodes().length === 0) {
      this.testLiveDomParser();
    }
  }
}
