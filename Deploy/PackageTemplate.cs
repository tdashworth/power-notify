namespace TDAshworth.PowerNotify.Deployment
{
    using System.ComponentModel.Composition;
    using Microsoft.Xrm.Tooling.PackageDeployment.CrmPackageExtentionBase;

    /// <summary>
    /// Import package starter frame.
    /// </summary>
    [Export(typeof(IImportExtensions))]
    public class PackageTemplate : ImportExtension
    {
        /// <inheritdoc/>
        public override string GetImportPackageDataFolderName => "PkgFolder";

        /// <inheritdoc/>
        public override string GetImportPackageDescriptionText => "Power Notify";

        /// <inheritdoc/>
        public override string GetLongNameOfImport => "Power Notify";

        /// <inheritdoc/>
        public override bool AfterPrimaryImport()
        {
            return true;
        }

        /// <inheritdoc/>
        public override bool BeforeImportStage()
        {
            return true;
        }

        /// <inheritdoc/>
        public override string GetNameOfImport(bool plural) => "Power Notify";

        /// <inheritdoc/>
        public override void InitializeCustomExtension()
        {
            return;
        }
    }
}
