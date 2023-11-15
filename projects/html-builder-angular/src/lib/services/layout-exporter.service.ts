import { Injectable } from '@angular/core';

class BaseLayoutCleaner {

  protected tagsToCleanup: string[] = [];

  constructor(protected html: string) {}

  getHtml(): string {
    return this.html;
  }

  removeComments(): BaseLayoutCleaner {
    this.html = this.html.replace(/<!--[\s\S]*?-->/g, '');

    return this;
  }

  /**
   * Removes the wrapper only, keeps the inner content.
   */
  cleanTags(): BaseLayoutCleaner {
    this.tagsToCleanup.forEach(tag => {
      const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'g');
      this.html = this.html.replace(regex, '$1');
    });

    return this;
  }

}

/**
 * Generally its really not good practice to manipulate HTML markup string with regexp,
 * but we use this only for component elements angular rendered, and for those only
 * which can not be embedded to itself.
 * Regexp is not working on html elements that are nested.
 */
class EmailLayoutCleaner extends BaseLayoutCleaner {

  tagsToCleanup = [
    'layout-render-email',
    'render-email-body',
    'render-email-row',
    'render-email-column',
    'render-email-content',
    'render-email-button',
    'render-email-divider',
    'render-email-head',
    'render-email-html',
    'render-email-image',
    'render-email-menu',
    'render-email-text',
    'render-email-variable',
  ];

}

class WebLayoutCleaner extends BaseLayoutCleaner {

  private readonly tagsToStrip = ['component-actions', 'component-drag-handle'];

  tagsToCleanup = [
    'render-html-body',
    'render-html-row',
    'render-html-column',
    'render-html-content',
    'render-html-button',
    'render-html-divider',
    'render-html-head',
    'render-html-html',
    'render-html-image',
    'render-html-menu',
    'render-html-text',
    'render-html-variable',
  ];

  removeContentEditableAttribs(): WebLayoutCleaner {
    this.html = this.html.replace(/contenteditable=""/g, '');

    return this;
  }

  /**
   * Wipes out this tags
   */
  stripTags(): WebLayoutCleaner {
    this.tagsToStrip.forEach(tag => {
      const regex = new RegExp(`<${tag}[\\s\\S]*?<\\/${tag}>`, 'g');
      this.html = this.html.replace(regex, '');
    });

    return this;
  }

}

@Injectable()
export class LayoutExporterService {

  cleanupEmailMarkup(html: string): string {
    return new EmailLayoutCleaner(html)
      .cleanTags()
      .removeComments()
      .getHtml();
  }

  cleanupWebMarkup(html: string): string {
    return new WebLayoutCleaner(html)
      .stripTags()
      .removeContentEditableAttribs()
      .cleanTags()
      .removeComments()
      .getHtml();
  }

}
