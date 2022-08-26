import { Scan } from '../../scans/scans-internal-api';
import { IntegerRenderValue, LitIvemIdArrayRenderValue, MarketIdArrayRenderValue, MatchedRenderValue, RenderValue, StringRenderValue } from '../../services/services-internal-api';
import { GridRecordField } from '../grid-revgrid-types';

export abstract class ScansGridField implements GridRecordField {
    readonly name: string;

    abstract getValue(record: Scan): RenderValue;
}

export class IdScansGridField extends ScansGridField {
    override getValue(record: Scan): RenderValue {
        return new StringRenderValue(record.id);
    }
}

export class IndexScansGridField extends ScansGridField {
    override getValue(record: Scan): RenderValue {
        return new IntegerRenderValue(record.index);
    }
}
export class NameScansGridField extends ScansGridField {
    override getValue(record: Scan): RenderValue {
        return new StringRenderValue(record.name);
    }
}
export class DescriptionScansGridField extends ScansGridField {
    override getValue(record: Scan): RenderValue {
        return new StringRenderValue(record.description);
    }
}
export class TargetTypeIdScansGridField extends ScansGridField {
    override getValue(record: Scan): RenderValue {
        return new Scan.TargetTypeIdRenderValue(record.targetTypeId);
    }
}
export class TargetMarketsScansGridField extends ScansGridField {
    override getValue(record: Scan): RenderValue {
        return new MarketIdArrayRenderValue(record.targetMarkets);
    }
}
export class TargetLitIvemIdsScansGridField extends ScansGridField {
    override getValue(record: Scan): RenderValue {
        return new LitIvemIdArrayRenderValue(record.targetLitIvemIds);
    }
}
export class MatchedScansGridField extends ScansGridField {
    override getValue(record: Scan): RenderValue {
        return new MatchedRenderValue(record.matched);
    }
}
export class ModifiedStatusIdScansGridField extends ScansGridField {
    override getValue(record: Scan): RenderValue {
        return new Scan.ModifiedStatusIdRenderValue(record.modifiedStatusId);
    }
}
