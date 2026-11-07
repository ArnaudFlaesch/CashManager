import { getElement } from "@testing/dom";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef } from "@angular/material/dialog";
import { environment } from "@environments/environment";
import { HttpErrorHandler } from "@core/http-error-handler";
import { ImportConfigModal } from "./import-config-modal";

describe("ImportConfigModal", () => {
  let fixture: ComponentFixture<ImportConfigModal>;
  let httpTestingController: HttpTestingController;

  const importConfigUrl = `${environment.backend_url}/cashManagerConfig/import`;
  const dialogRef = { close: vi.fn() };
  const file = new File(["{}"], "cashManagerData.json");

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialogRef, useValue: dialogRef }, provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(ImportConfigModal);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.restoreAllMocks();
    dialogRef.close.mockClear();
  });

  function getUploadButton(): HTMLButtonElement {
    return getElement(fixture, "#upload-file-button", HTMLButtonElement);
  }

  /** Selects the file in the input, as the user would. */
  async function selectFile(): Promise<void> {
    const input = getElement(fixture, "#file", HTMLInputElement);
    Object.defineProperty(input, "files", { value: [file] });
    input.dispatchEvent(new Event("change"));
    await fixture.whenStable();
  }

  it("Should only allow the import once a file is selected", async () => {
    await fixture.whenStable();
    expect(getUploadButton().disabled).toBe(true);

    getUploadButton().click();
    httpTestingController.expectNone(importConfigUrl);

    await selectFile();
    expect(getUploadButton().disabled).toBe(false);
  });

  it("Should import the selected file, then close the modal and reload the page", async () => {
    // jsdom does not implement the reload of the page
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    await selectFile();

    getUploadButton().click();
    const request = httpTestingController.expectOne(importConfigUrl);
    expect((request.request.body as FormData).get("file")).toEqual(file);
    request.flush(true);

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it("Should display an error when the file cannot be imported", async () => {
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(HttpErrorHandler), "handleError")
      .mockImplementation(() => undefined);
    await selectFile();

    getUploadButton().click();
    httpTestingController
      .expectOne(importConfigUrl)
      .flush(null, { status: 500, statusText: "Server error" });

    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors de l'import de la configuration."
    );
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
